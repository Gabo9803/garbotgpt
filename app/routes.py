from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, current_app, send_file
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from app.models import User, ChatHistory, ChatSettings
from werkzeug.security import generate_password_hash, check_password_hash
import openai
import google.generativeai as genai
from app.config import Config
from app import db
from sqlalchemy.exc import ProgrammingError, OperationalError
from datetime import datetime
import logging
import io
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configura les claus API i valida-les
if not Config.OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY no està definida a la configuració.")
if not Config.GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY no està definida a la configuració.")

openai.api_key = Config.OPENAI_API_KEY
genai.configure(api_key=Config.GOOGLE_API_KEY)

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
            logger.error(f"Database error during registration: {str(e)}")
            flash('Error de base de datos: Intenta de nuevo más tarde.', 'danger')
            return render_template('register.html')
        except Exception as e:
            db.session.rollback()
            logger.error(f"Unexpected error during registration: {str(e)}")
            flash('Ocurrió un error inesperado.', 'danger')
            return render_template('register.html')
    return render_template('register.html', authenticated=current_user.is_authenticated)

@current_app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@current_app.route('/settings', methods=['GET', 'POST'])
@login_required
def settings():
    if request.method == 'POST':
        try:
            new_username = request.form.get('username')
            new_password = request.form.get('password')
            theme = request.form.get('theme')
            if new_username and new_username != current_user.username:
                existing_user = User.query.filter_by(username=new_username).first()
                if existing_user:
                    flash('El usuario ya existe', 'warning')
                else:
                    current_user.username = new_username
            if new_password:
                current_user.password = generate_password_hash(new_password, method='pbkdf2:sha256')
            current_user.theme = theme or 'light'
            
            chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
            if not chat_settings:
                chat_settings = ChatSettings(user_id=current_user.id)
                db.session.add(chat_settings)
            chat_settings.model = request.form.get('model', 'gpt-3.5-turbo')
            chat_settings.temperature = float(request.form.get('temperature', 0.7))
            chat_settings.max_tokens = int(request.form.get('max_tokens', 2000))
            chat_settings.theme_color = request.form.get('theme_color', '#007bff')
            
            db.session.commit()
            flash('Configuración actualizada correctamente', 'success')
            return redirect(url_for('settings'))
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating settings: {str(e)}")
            flash('Error al actualizar la configuración', 'danger')
    chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
    return render_template('settings.html', chat_settings=chat_settings, authenticated=current_user.is_authenticated)

@current_app.route('/chat', methods=['GET', 'POST'])
@login_required
def chat():
    if request.method == 'POST':
        user_message = request.json.get('message')
        regenerate = request.json.get('regenerate', False)
        if not user_message and not regenerate:
            return jsonify({'error': 'Se requiere un mensaje'}), 400
        try:
            chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
            if not chat_settings:
                chat_settings = ChatSettings(user_id=current_user.id)
                db.session.add(chat_settings)
                db.session.commit()
            
            # Configurar missatges inicials amb instruccions de llenguatge
            messages = []
            if chat_settings.model.startswith('gemini'):
                messages.append({"role": "system", "content": "Ets GarBotGPT, un assistent d'IA útil creat per xAI. Respon sempre en català."})
            else:  # OpenAI
                messages.append({"role": "system", "content": "Eres GarBotGPT, un asistente de IA útil creado por xAI. Responde siempre en castellano."})
            messages.append({"role": "user", "content": user_message})
            
            if regenerate:
                last_entry = ChatHistory.query.filter_by(user_id=current_user.id).order_by(ChatHistory.timestamp.desc()).first()
                if last_entry:
                    messages = []
                    if chat_settings.model.startswith('gemini'):
                        messages.append({"role": "system", "content": "Ets GarBotGPT, un assistent d'IA útil creat per xAI. Respon sempre en català."})
                    else:
                        messages.append({"role": "system", "content": "Eres GarBotGPT, un asistente de IA útil creado por xAI. Responde siempre en castellano."})
                    messages.append({"role": "user", "content": last_entry.message})
                    user_message = last_entry.message
            
            # Determinar si utilitzem OpenAI o Gemini basant-nos en el model seleccionat
            ai_response = None
            if chat_settings.model.startswith('gemini'):
                try:
                    model_instance = genai.GenerativeModel(chat_settings.model)
                    response = model_instance.generate_content(
                        user_message,
                        generation_config=genai.types.GenerationConfig(
                            temperature=chat_settings.temperature,
                            max_output_tokens=chat_settings.max_tokens
                        )
                    )
                    ai_response = response.text
                except Exception as e:
                    logger.error(f"Error amb Gemini API: {str(e)}")
                    return jsonify({'error': 'Error al connectar amb Gemini API'}), 500
            else:  # OpenAI
                try:
                    response = openai.chat.completions.create(
                        model=chat_settings.model,
                        messages=messages,
                        temperature=chat_settings.temperature,
                        max_tokens=chat_settings.max_tokens
                    )
                    ai_response = response.choices[0].message.content
                except Exception as e:
                    logger.error(f"Error amb OpenAI API: {str(e)}")
                    return jsonify({'error': 'Error al connectar amb OpenAI API'}), 500
            
            if not regenerate:
                chat_entry = ChatHistory(user_id=current_user.id, message=user_message, response=ai_response)
                db.session.add(chat_entry)
                db.session.commit()
                chat_entry_id = chat_entry.id
            else:
                last_entry.response = ai_response
                chat_entry_id = last_entry.id
                db.session.commit()
            
            return jsonify({'id': chat_entry_id, 'response': ai_response})
        except Exception as e:
            logger.error(f"Error in chat: {str(e)}")
            return jsonify({'error': str(e)}), 500
    history = ChatHistory.query.filter_by(user_id=current_user.id).order_by(ChatHistory.timestamp.asc()).all()
    chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
    return render_template('chat.html', history=history, chat_settings=chat_settings, authenticated=current_user.is_authenticated)

@current_app.route('/edit_message', methods=['POST'])
@login_required
def edit_message():
    try:
        data = request.get_json()
        message_id = data.get('id')
        new_message = data.get('message')
        if not message_id or not new_message:
            return jsonify({'error': 'ID or message missing'}), 400

        chat_entry = ChatHistory.query.filter_by(id=message_id, user_id=current_user.id).first()
        if not chat_entry:
            return jsonify({'error': 'Message not found'}), 404

        chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
        messages = []
        if chat_settings.model.startswith('gemini'):
            messages.append({"role": "system", "content": "Ets GarBotGPT, un assistent d'IA útil creat per xAI. Respon sempre en català."})
        else:
            messages.append({"role": "system", "content": "Eres GarBotGPT, un asistente de IA útil creado por xAI. Responde siempre en castellano."})
        messages.append({"role": "user", "content": new_message})

        if chat_settings.model.startswith('gemini'):
            try:
                model_instance = genai.GenerativeModel(chat_settings.model)
                response = model_instance.generate_content(
                    new_message,
                    generation_config=genai.types.GenerationConfig(
                        temperature=chat_settings.temperature,
                        max_output_tokens=chat_settings.max_tokens
                    )
                )
                bot_response = response.text
            except Exception as e:
                logger.error(f"Error amb Gemini API: {str(e)}")
                return jsonify({'error': 'Error al connectar amb Gemini API'}), 500
        else:
            try:
                response = openai.chat.completions.create(
                    model=chat_settings.model,
                    messages=messages,
                    temperature=chat_settings.temperature,
                    max_tokens=chat_settings.max_tokens
                )
                bot_response = response.choices[0].message.content
            except Exception as e:
                logger.error(f"Error amb OpenAI API: {str(e)}")
                return jsonify({'error': 'Error al connectar amb OpenAI API'}), 500

        chat_entry.message = new_message
        chat_entry.response = bot_response
        chat_entry.timestamp = datetime.utcnow()
        db.session.commit()

        return jsonify({'response': bot_response})
    except Exception as e:
        logger.error(f"Error editing message: {str(e)}")
        return jsonify({'error': str(e)}), 500

@current_app.route('/clear_history', methods=['POST'])
@login_required
def clear_history():
    try:
        ChatHistory.query.filter_by(user_id=current_user.id).delete()
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
        history = ChatHistory.query.filter_by(user_id=current_user.id).order_by(ChatHistory.timestamp.asc()).all()
        output = io.StringIO()
        for entry in history:
            output.write(f"[{entry.timestamp}] Tú: {entry.message}\n")
            output.write(f"[{entry.timestamp}] GarBotGPT: {entry.response}\n\n")
        output.seek(0)
        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8')),
            mimetype='text/plain',
            as_attachment=True,
            download_name='historial_chat.txt'
        )
    except Exception as e:
        logger.error(f"Error exporting history: {str(e)}")
        flash('Error al exportar el historial de chat', 'danger')
        return redirect(url_for('chat'))

@current_app.route('/export_settings', methods=['GET'])
@login_required
def export_settings():
    try:
        chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
        settings = {
            'model': chat_settings.model,
            'temperature': chat_settings.temperature,
            'max_tokens': chat_settings.max_tokens,
            'theme_color': chat_settings.theme_color
        }
        return send_file(
            io.BytesIO(json.dumps(settings, indent=2).encode('utf-8')),
            mimetype='application/json',
            as_attachment=True,
            download_name='chat_settings.json'
        )
    except Exception as e:
        logger.error(f"Error exporting settings: {str(e)}")
        flash('Error al exportar la configuración', 'danger')
        return redirect(url_for('chat'))

@current_app.route('/update_theme', methods=['POST'])
@login_required
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
        logger.error(f"Error updating theme: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@current_app.route('/update_language', methods=['POST'])
@login_required
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
        logger.error(f"Error updating language: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@current_app.route('/update_chat_settings', methods=['POST'])
@login_required
def update_chat_settings():
    try:
        data = request.json
        chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
        if not chat_settings:
            chat_settings = ChatSettings(user_id=current_user.id)
            db.session.add(chat_settings)
        chat_settings.model = data.get('model', 'gpt-3.5-turbo')
        chat_settings.temperature = float(data.get('temperature', 0.7))
        chat_settings.max_tokens = int(data.get('max_tokens', 2000))
        chat_settings.theme_color = data.get('theme_color', '#007bff')
        db.session.commit()
        logger.info(f"Configuración de chat actualizada para usuario {current_user.username}")
        return jsonify({'success': True})
    except Exception as e:
        logger.error(f"Error updating chat settings: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@current_app.route('/maintenance')
def maintenance():
    return render_template('maintenance.html')