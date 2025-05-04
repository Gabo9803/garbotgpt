from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, current_app, send_file
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from app.models import User, ChatSettings, ChatHistory, MessageReaction, ConversationSummary
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import openai
from app.config import Config
from app import db, cache
from sqlalchemy.exc import ProgrammingError, OperationalError
from sqlalchemy import or_
import logging
import io
import json
import os
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from datetime import datetime
import markdown
import PyPDF2
from PIL import Image
import latex

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

openai.api_key = Config.OPENAI_API_KEY

limiter = Limiter(app=current_app, key_func=get_remote_address, default_limits=[Config.RATE_LIMIT])

login_manager = LoginManager()
login_manager.init_app(current_app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@current_app.route('/')
def index():
    return render_template('index.html', authenticated=current_user.is_authenticated)

@current_app.route('/login', methods=['GET', 'POST'])
@limiter.limit("5 per minute")
def login():
    if current_user.is_authenticated:
        return redirect(url_for('chat'))
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if not username or not password:
            flash('Usuario y contraseña requeridos', 'danger')
            return render_template('login.html')
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('chat'))
        flash('Usuario o contraseña inválidos', 'danger')
    return render_template('login.html', authenticated=current_user.is_authenticated)

@current_app.route('/register', methods=['GET', 'POST'])
@limiter.limit("5 per minute")
def register():
    if current_user.is_authenticated:
        return redirect(url_for('chat'))
    if request.method == 'POST':
        try:
            logger.info("Verificando conexión a la base de datos...")
            db.session.execute("SELECT 1")
            logger.info("Conexión a la base de datos exitosa.")
            
            username = request.form.get('username')
            password = request.form.get('password')
            logger.info(f"Intento de registro con username: {username}")
            if not username or not password:
                flash('Usuario y contraseña requeridos', 'danger')
                return render_template('register.html')
            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                flash('El usuario ya existe', 'warning')
            else:
                hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
                new_user = User(username=username, password=hashed_password)
                db.session.add(new_user)
                db.session.commit()
                chat_settings = ChatSettings(user_id=new_user.id)
                db.session.add(chat_settings)
                db.session.commit()
                flash('¡Registro exitoso! Por favor, inicia sesión.', 'success')
                logger.info(f"Usuario {username} registrado exitosamente.")
                return redirect(url_for('login'))
        except (ProgrammingError, OperationalError) as e:
            db.session.rollback()
            logger.error(f"Error de base de datos durante el registro: {str(e)}")
            flash('Error de base de datos: Intenta de nuevo más tarde.', 'danger')
            return render_template('register.html')
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error inesperado durante el registro: {str(e)}")
            flash('Ocurrió un error inesperado.', 'danger')
            return render_template('register.html')
    return render_template('register.html', authenticated=current_user.is_authenticated)

@current_app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Sesión cerrada.', 'success')
    return redirect(url_for('index'))

@current_app.route('/settings', methods=['GET', 'POST'])
@login_required
@limiter.limit("10 per minute")
def settings():
    if request.method == 'POST':
        try:
            new_username = request.form.get('username')
            new_password = request.form.get('password')
            theme = request.form.get('theme')
            language = request.form.get('language')
            if new_username and new_username != current_user.username:
                existing_user = User.query.filter_by(username=new_username).first()
                if existing_user:
                    flash('El usuario ya existe', 'warning')
                else:
                    current_user.username = new_username
            if new_password:
                current_user.password = generate_password_hash(new_password, method='pbkdf2:sha256')
            current_user.theme = theme or 'light'
            current_user.language = language or 'es'
            
            chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
            if not chat_settings:
                chat_settings = ChatSettings(user_id=current_user.id)
                db.session.add(chat_settings)
            chat_settings.model = request.form.get('model', 'gpt-3.5-turbo')
            chat_settings.temperature = float(request.form.get('temperature', 0.7))
            chat_settings.max_tokens = int(request.form.get('max_tokens', 1000))
            chat_settings.theme_color = request.form.get('theme_color', '#007bff')
            chat_settings.response_tone = request.form.get('response_tone', 'neutral')
            chat_settings.max_context_messages = int(request.form.get('max_context_messages', 10))
            
            db.session.commit()
            flash('Configuración actualizada correctamente', 'success')
            return redirect(url_for('settings'))
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error al actualizar configuración: {str(e)}")
            flash('Error al actualizar la configuración', 'danger')
    chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
    return render_template('settings.html', chat_settings=chat_settings, authenticated=current_user.is_authenticated)

@current_app.route('/chat', methods=['GET', 'POST'])
@login_required
@limiter.limit("10 per minute")
@cache.memoize(timeout=Config.CACHE_TIMEOUT)
def chat():
    if request.method == 'POST':
        user_message = request.json.get('message')
        regenerate = request.json.get('regenerate', False)
        if not user_message and not regenerate:
            return jsonify({'error': 'Se requiere un mensaje'}), 400
        if len(user_message) > Config.MAX_MESSAGE_LENGTH:
            return jsonify({'error': f'El mensaje excede el límite de {Config.MAX_MESSAGE_LENGTH} caracteres'}), 400
        
        try:
            chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
            if not chat_settings:
                chat_settings = ChatSettings(user_id=current_user.id)
                db.session.add(chat_settings)
                db.session.commit()
            
            # Obtener historial para contexto
            history = ChatHistory.query.filter_by(user_id=current_user.id).order_by(ChatHistory.timestamp.desc()).limit(chat_settings.max_context_messages).all()
            messages = [{"role": "system", "content": f"Eres GarBotGPT, un asistente de IA creado por xAI. Responde en el idioma del usuario ({current_user.language}) con un tono {chat_settings.response_tone}."}]
            for entry in reversed(history):
                messages.append({"role": "user", "content": entry.message})
                messages.append({"role": "assistant", "content": entry.response})
            
            if regenerate:
                last_entry = ChatHistory.query.filter_by(user_id=current_user.id).order_by(ChatHistory.timestamp.desc()).first()
                if last_entry:
                    messages[-2] = {"role": "user", "content": last_entry.message}
            else:
                messages.append({"role": "user", "content": user_message})
            
            response = openai.chat.completions.create(
                model=chat_settings.model,
                messages=messages,
                temperature=chat_settings.temperature,
                max_tokens=chat_settings.max_tokens
            )
            ai_response = response.choices[0].message.content
            
            if not regenerate:
                chat_entry = ChatHistory(
                    user_id=current_user.id,
                    message=user_message,
                    response=ai_response,
                    response_tone=chat_settings.response_tone
                )
                db.session.add(chat_entry)
            else:
                last_entry.response = ai_response
                last_entry.response_tone = chat_settings.response_tone
            
            # Generar resumen automático si hay más de 20 mensajes
            history_count = ChatHistory.query.filter_by(user_id=current_user.id).count()
            if history_count >= 20 and history_count % 20 == 0:
                summary = generate_conversation_summary(current_user.id, chat_settings)
                new_summary = ConversationSummary(user_id=current_user.id, summary=summary)
                db.session.add(new_summary)
            
            db.session.commit()
            
            # Generar sugerencias contextuales
            suggestions = generate_contextual_suggestions(user_message, ai_response, chat_settings)
            
            return jsonify({'response': ai_response, 'suggestions': suggestions})
        except Exception as e:
            logger.error(f"Error en el chat: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    history = ChatHistory.query.filter_by(user_id=current_user.id).order_by(ChatHistory.timestamp.asc()).all()
    chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
    return render_template('chat.html', history=history, chat_settings=chat_settings, authenticated=current_user.is_authenticated)

@current_app.route('/upload', methods=['POST'])
@login_required
@limiter.limit("5 per minute")
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No se proporcionó archivo'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Archivo no seleccionado'}), 400
        
        filename = secure_filename(file.filename)
        if not allowed_file(filename):
            return jsonify({'error': 'Tipo de archivo no permitido'}), 400
        
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Procesar archivo para análisis
        file_content = process_uploaded_file(file_path, filename)
        
        chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
        chat_entry = ChatHistory(
            user_id=current_user.id,
            message=f"[Archivo subido: {filename}]",
            response=f"Archivo recibido: {filename}. {file_content}",
            file_attachment=file_path,
            response_tone=chat_settings.response_tone
        )
        db.session.add(chat_entry)
        db.session.commit()
        
        return jsonify({'success': True, 'filename': filename, 'response': chat_entry.response})
    except Exception as e:
        logger.error(f"Error al subir archivo: {str(e)}")
        return jsonify({'error': str(e)}), 500

@current_app.route('/summarize', methods=['POST'])
@login_required
@limiter.limit("2 per minute")
def summarize_conversation():
    try:
        chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
        summary = generate_conversation_summary(current_user.id, chat_settings)
        new_summary = ConversationSummary(user_id=current_user.id, summary=summary)
        db.session.add(new_summary)
        db.session.commit()
        return jsonify({'summary': summary})
    except Exception as e:
        logger.error(f"Error al resumir conversación: {str(e)}")
        return jsonify({'error': str(e)}), 500

@current_app.route('/react', methods=['POST'])
@login_required
@limiter.limit("10 per minute")
def add_reaction():
    try:
        data = request.json
        message_id = data.get('message_id')
        reaction = data.get('reaction')
        if not message_id or not reaction:
            return jsonify({'error': 'Se requiere message_id y reaction'}), 400
        
        chat_entry = ChatHistory.query.get(message_id)
        if not chat_entry or chat_entry.user_id != current_user.id:
            return jsonify({'error': 'Mensaje no encontrado o no autorizado'}), 403
        
        existing_reaction = MessageReaction.query.filter_by(
            chat_history_id=message_id, reaction=reaction
        ).first()
        if existing_reaction:
            existing_reaction.count += 1
        else:
            new_reaction = MessageReaction(chat_history_id=message_id, reaction=reaction)
            db.session.add(new_reaction)
        
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        logger.error(f"Error al añadir reacción: {str(e)}")
        return jsonify({'error': str(e)}), 500

@current_app.route('/edit_message', methods=['POST'])
@login_required
@limiter.limit("5 per minute")
def edit_message():
    try:
        data = request.json
        message_id = data.get('message_id')
        new_message = data.get('message')
        if not message_id or not new_message:
            return jsonify({'error': 'Se requiere message_id y message'}), 400
        if len(new_message) > Config.MAX_MESSAGE_LENGTH:
            return jsonify({'error': f'El mensaje excede el límite de {Config.MAX_MESSAGE_LENGTH} caracteres'}), 400
        
        chat_entry = ChatHistory.query.get(message_id)
        if not chat_entry or chat_entry.user_id != current_user.id:
            return jsonify({'error': 'Mensaje no encontrado o no autorizado'}), 403
        
        chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
        
        # Actualizar mensaje y regenerar respuesta
        chat_entry.message = new_message
        history = ChatHistory.query.filter_by(user_id=current_user.id).order_by(ChatHistory.timestamp.desc()).limit(chat_settings.max_context_messages).all()
        messages = [{"role": "system", "content": f"Eres GarBotGPT, un asistente de IA creado por xAI. Responde en el idioma del usuario ({current_user.language}) con un tono {chat_settings.response_tone}."}]
        for entry in reversed(history):
            if entry.id != message_id:
                messages.append({"role": "user", "content": entry.message})
                messages.append({"role": "assistant", "content": entry.response})
        messages.append({"role": "user", "content": new_message})
        
        response = openai.chat.completions.create(
            model=chat_settings.model,
            messages=messages,
            temperature=chat_settings.temperature,
            max_tokens=chat_settings.max_tokens
        )
        chat_entry.response = response.choices[0].message.content
        chat_entry.response_tone = chat_settings.response_tone
        db.session.commit()
        
        return jsonify({'success': True, 'response': chat_entry.response})
    except Exception as e:
        logger.error(f"Error al editar mensaje: {str(e)}")
        return jsonify({'error': str(e)}), 500

@current_app.route('/search_history', methods=['POST'])
@login_required
@limiter.limit("10 per minute")
def search_history():
    try:
        query = request.json.get('query')
        if not query:
            return jsonify({'error': 'Se requiere una consulta de búsqueda'}), 400
        
        results = ChatHistory.query.filter(
            ChatHistory.user_id == current_user.id,
            or_(
                ChatHistory.message.ilike(f'%{query}%'),
                ChatHistory.response.ilike(f'%{query}%')
            )
        ).order_by(ChatHistory.timestamp.desc()).limit(50).all()
        
        return jsonify({
            'results': [
                {
                    'id': entry.id,
                    'message': entry.message,
                    'response': entry.response,
                    'timestamp': entry.timestamp.isoformat(),
                    'file_attachment': entry.file_attachment
                } for entry in results
            ]
        })
    except Exception as e:
        logger.error(f"Error al buscar historial: {str(e)}")
        return jsonify({'error': str(e)}), 500

@current_app.route('/clear_history', methods=['POST'])
@login_required
@limiter.limit("2 per minute")
def clear_history():
    try:
        ChatHistory.query.filter_by(user_id=current_user.id).delete()
        ConversationSummary.query.filter_by(user_id=current_user.id).delete()
        db.session.commit()
        logger.info(f"Historial de chat borrado para usuario {current_user.username}")
        return jsonify({'success': True})
    except Exception as e:
        logger.error(f"Error al borrar historial: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@current_app.route('/export_history', methods=['GET'])
@login_required
def export_history():
    try:
        format = request.args.get('format', 'txt')
        history = ChatHistory.query.filter_by(user_id=current_user.id).order_by(ChatHistory.timestamp.asc()).all()
        
        if format == 'txt':
            output = io.StringIO()
            for entry in history:
                output.write(f"[{entry.timestamp}] Tú: {entry.message}\n")
                output.write(f"[{entry.timestamp}] GarBotGPT: {entry.response}\n")
                if entry.file_attachment:
                    output.write(f"[Archivo: {entry.file_attachment}]\n")
                for reaction in entry.reactions:
                    output.write(f"[Reacción: {reaction.reaction} x{reaction.count} @ {reaction.timestamp}]\n")
                output.write("\n")
            output.seek(0)
            return send_file(
                io.BytesIO(output.getvalue().encode('utf-8')),
                mimetype='text/plain',
                as_attachment=True,
                download_name='historial_chat.txt'
            )
        elif format == 'json':
            data = [
                {
                    'timestamp': entry.timestamp.isoformat(),
                    'message': entry.message,
                    'response': entry.response,
                    'file_attachment': entry.file_attachment,
                    'reactions': [{'reaction': r.reaction, 'count': r.count, 'timestamp': r.timestamp.isoformat()} for r in entry.reactions]
                } for entry in history
            ]
            return send_file(
                io.BytesIO(json.dumps(data, indent=2).encode('utf-8')),
                mimetype='application/json',
                as_attachment=True,
                download_name='historial_chat.json'
            )
        elif format == 'pdf':
            latex_content = r"""
            \documentclass{article}
            \usepackage[utf8]{inputenc}
            \usepackage{geometry}
            \geometry{a4paper, margin=1in}
            \usepackage{DejaVuSans}
            \usepackage[T1]{fontenc}
            \usepackage{amsmath}
            \usepackage{xcolor}
            \begin{document}
            \title{Historial de Chat - GarBotGPT}
            \author{Usuario: """ + current_user.username + r"""}
            \date{\today}
            \maketitle
            \section*{Conversaciones}
            """
            for entry in history:
                latex_content += r"\subsection*{Mensaje - " + entry.timestamp.strftime('%Y-%m-%d %H:%M:%S') + r"}"
                latex_content += r"\textbf{Tú:} " + latex_escape(entry.message) + r"\\"
                latex_content += r"\textbf{GarBotGPT:} " + latex_escape(entry.response) + r"\\"
                if entry.file_attachment:
                    latex_content += r"\textit{Archivo: " + latex_escape(entry.file_attachment) + r"}\\"
                for reaction in entry.reactions:
                    latex_content += r"\textit{Reacción: " + latex_escape(reaction.reaction) + r" x" + str(reaction.count) + r" @ " + reaction.timestamp.strftime('%Y-%m-%d %H:%M:%S') + r"}\\"
            latex_content += r"\end{document}"
            pdf_buffer = generate_pdf(latex_content)
            return send_file(
                pdf_buffer,
                mimetype='application/pdf',
                as_attachment=True,
                download_name='historial_chat.pdf'
            )
        else:
            return jsonify({'error': 'Formato no soportado'}), 400
    except Exception as e:
        logger.error(f"Error al exportar historial: {str(e)}")
        flash('Error al exportar el historial de chat', 'danger')
        return redirect(url_for('chat'))

@current_app.route('/update_theme', methods=['POST'])
@login_required
@limiter.limit("10 per minute")
def update_theme():
    try:
        data = request.json
        theme = data.get('theme')
        if theme not in ['light', 'dark']:
            return jsonify({'success': False, 'error': 'Tema inválido'}), 400
        current_user.theme = theme
        db.session.commit()
        logger.info(f"Tema actualizado a {theme} para usuario {current_user.username}")
        return jsonify({'success': True})
    except Exception as e:
        logger.error(f"Error al actualizar tema: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@current_app.route('/update_language', methods=['POST'])
@login_required
@limiter.limit("10 per minute")
def update_language():
    try:
        data = request.json
        language = data.get('language')
        if language not in ['es', 'en', 'ca']:
            return jsonify({'success': False, 'error': 'Idioma inválido'}), 400
        current_user.language = language
        db.session.commit()
        logger.info(f"Idioma actualizado a {language} para usuario {current_user.username}")
        return jsonify({'success': True})
    except Exception as e:
        logger.error(f"Error al actualizar idioma: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@current_app.route('/update_chat_settings', methods=['POST'])
@login_required
@limiter.limit("10 per minute")
def update_chat_settings():
    try:
        data = request.json
        chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
        if not chat_settings:
            chat_settings = ChatSettings(user_id=current_user.id)
            db.session.add(chat_settings)
        chat_settings.model = data.get('model', 'gpt-3.5-turbo')
        chat_settings.temperature = float(data.get('temperature', 0.7))
        chat_settings.max_tokens = int(data.get('max_tokens', 1000))
        chat_settings.theme_color = data.get('theme_color', '#007bff')
        chat_settings.response_tone = data.get('response_tone', 'neutral')
        chat_settings.max_context_messages = int(data.get('max_context_messages', 10))
        db.session.commit()
        logger.info(f"Configuración de chat actualizada para usuario {current_user.username}")
        return jsonify({'success': True})
    except Exception as e:
        logger.error(f"Error al actualizar configuración de chat: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# Funciones auxiliares
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

def process_uploaded_file(file_path, filename):
    try:
        extension = filename.rsplit('.', 1)[1].lower()
        if extension == 'pdf':
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() or ""
                return f"Contenido del PDF: {text[:500]}..." if text else "No se pudo extraer texto del PDF."
        elif extension in {'png', 'jpg', 'jpeg', 'gif'}:
            with Image.open(file_path) as img:
                width, height = img.size
                return f"Imagen subida: {filename} ({width}x{height} píxeles)."
        elif extension == 'txt':
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
                return f"Contenido del archivo de texto: {content[:500]}..." if content else "El archivo de texto está vacío."
        else:
            return "Archivo recibido, pero no se puede procesar el contenido."
    except Exception as e:
        logger.error(f"Error al procesar archivo {filename}: {str(e)}")
        return "Error al procesar el archivo."

def generate_conversation_summary(user_id, chat_settings):
    try:
        history = ChatHistory.query.filter_by(user_id=user_id).order_by(ChatHistory.timestamp.desc()).limit(50).all()
        if not history:
            return "No hay historial para resumir."
        
        conversation_text = '\n'.join([f"Usuario: {entry.message}\nGarBotGPT: {entry.response}" for entry in reversed(history)])
        prompt = f"Resume esta conversación en un párrafo conciso en el idioma del usuario ({current_user.language}) con un tono {chat_settings.response_tone}:\n{conversation_text}"
        
        response = openai.chat.completions.create(
            model=chat_settings.model,
            messages=[
                {"role": "system", "content": "Eres GarBotGPT, un asistente de IA útil creado por xAI."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=200
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Error al generar resumen: {str(e)}")
        return "Error al generar el resumen de la conversación."

def generate_contextual_suggestions(user_message, ai_response, chat_settings):
    try:
        prompt = f"Basado en el mensaje del usuario: '{user_message}' y la respuesta de la IA: '{ai_response}', genera 3 sugerencias de seguimiento en el idioma del usuario ({current_user.language}) con un tono {chat_settings.response_tone}."
        response = openai.chat.completions.create(
            model=chat_settings.model,
            messages=[
                {"role": "system", "content": "Eres GarBotGPT, un asistente de IA útil creado por xAI."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=150
        )
        suggestions = response.choices[0].message.content.split('\n')[:3]
        return [s.strip('- ').strip() for s in suggestions if s.strip()]
    except Exception as e:
        logger.error(f"Error al generar sugerencias: {str(e)}")
        return ["Pregunta más detalles", "Explora un tema relacionado", "Pide un ejemplo"]

def latex_escape(text):
    replacements = {
        '&': r'\&',
        '%': r'\%',
        '$': r'\$',
        '#': r'\#',
        '_': r'\_',
        '{': r'\{',
        '}': r'\}',
        '~': r'\textasciitilde{}',
        '^': r'\textasciicircum{}',
        '\\': r'\textbackslash{}'
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

def generate_pdf(latex_content):
    try:
        import subprocess
        import tempfile
        
        with tempfile.NamedTemporaryFile(suffix='.tex', delete=False) as tex_file:
            tex_file.write(latex_content.encode('utf-8'))
            tex_file_path = tex_file.name
        
        pdf_buffer = io.BytesIO()
        subprocess.run(['latexmk', '-pdf', '-interaction=nonstopmode', tex_file_path], check=True)
        
        pdf_path = tex_file_path.replace('.tex', '.pdf')
        with open(pdf_path, 'rb') as f:
            pdf_buffer.write(f.read())
        
        pdf_buffer.seek(0)
        
        # Limpiar archivos temporales
        for ext in ['.tex', '.pdf', '.aux', '.log', '.fls', '.fdb_latexmk']:
            try:
                os.remove(tex_file_path.replace('.tex', ext))
            except:
                pass
        
        return pdf_buffer
    except Exception as e:
        logger.error(f"Error al generar PDF: {str(e)}")
        raise