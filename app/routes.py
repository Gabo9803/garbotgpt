from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, current_app, send_file
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from app.models import User, ChatHistory, ChatSettings
from werkzeug.security import generate_password_hash, check_password_hash
import openai
from app.config import Config
from app import db
from sqlalchemy.exc import ProgrammingError, OperationalError
import logging
import io

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configurar cliente de OpenAI
openai.api_key = Config.OPENAI_API_KEY

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
            flash('El nom d\'usuari i la contrasenya són obligatoris', 'danger')
            return render_template('login.html')
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('chat'))
        flash('Nom d\'usuari o contrasenya incorrectes', 'danger')
    return render_template('login.html', authenticated=current_user.is_authenticated)

@current_app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('chat'))
    if request.method == 'POST':
        try:
            logger.info("Verificant connexió a la base de dades...")
            db.session.execute("SELECT 1")
            logger.info("Connexió a la base de dades exitosa.")
            
            username = request.form.get('username')
            password = request.form.get('password')
            logger.info(f"Intent de registre amb nom d'usuari: {username}")
            if not username or not password:
                flash('El nom d\'usuari i la contrasenya són obligatoris', 'danger')
                return render_template('register.html')
            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                flash('El nom d\'usuari ja existeix', 'warning')
            else:
                hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
                new_user = User(username=username, password=hashed_password)
                db.session.add(new_user)
                db.session.commit()
                # Crear configuració de xat per defecte
                chat_settings = ChatSettings(user_id=new_user.id)
                db.session.add(chat_settings)
                db.session.commit()
                flash('Registre exitós! Inicia sessió.', 'success')
                logger.info(f"Usuari {username} registrat amb èxit.")
                return redirect(url_for('login'))
        except (ProgrammingError, OperationalError) as e:
            db.session.rollback()
            logger.error(f"Error de base de dades durant el registre: {str(e)}")
            flash('Error de base de dades: Torna-ho a provar més tard.', 'danger')
            return render_template('register.html')
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error inesperat durant el registre: {str(e)}")
            flash('Ha ocorregut un error inesperat.', 'danger')
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
            if request.is_json:
                # Manejar solicitud JSON del modal
                data = request.json
                chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
                if not chat_settings:
                    chat_settings = ChatSettings(user_id=current_user.id)
                    db.session.add(chat_settings)
                chat_settings.model = data.get('model', 'gpt-3.5-turbo')
                chat_settings.temperature = float(data.get('temperature', 0.7))
                chat_settings.max_tokens = int(data.get('max_tokens', 1000))
                db.session.commit()
                return jsonify({'success': True})
            else:
                # Manejar solicitud de formulario
                new_username = request.form.get('username')
                new_password = request.form.get('password')
                theme = request.form.get('theme')
                if new_username and new_username != current_user.username:
                    existing_user = User.query.filter_by(username=new_username).first()
                    if existing_user:
                        flash('El nom d\'usuari ja existeix', 'warning')
                    else:
                        current_user.username = new_username
                if new_password:
                    current_user.password = generate_password_hash(new_password, method='pbkdf2:sha256')
                current_user.theme = theme or 'light'
                
                # Actualitzar configuració de xat
                chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
                if not chat_settings:
                    chat_settings = ChatSettings(user_id=current_user.id)
                    db.session.add(chat_settings)
                chat_settings.model = request.form.get('model', 'gpt-3.5-turbo')
                chat_settings.temperature = float(request.form.get('temperature', 0.7))
                chat_settings.max_tokens = int(request.form.get('max_tokens', 1000))
                
                db.session.commit()
                flash('Configuració actualitzada amb èxit', 'success')
                return redirect(url_for('settings'))
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error actualitzant la configuració: {str(e)}")
            if request.is_json:
                return jsonify({'success': False, 'error': str(e)}), 500
            flash('Error en actualitzar la configuració', 'danger')
    chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
    return render_template('settings.html', chat_settings=chat_settings, authenticated=current_user.is_authenticated)

@current_app.route('/chat', methods=['GET', 'POST'])
@login_required
def chat():
    if request.method == 'POST':
        user_message = request.json.get('message')
        regenerate = request.json.get('regenerate', False)
        if not user_message and not regenerate:
            return jsonify({'error': 'El missatge és obligatori'}), 400
        try:
            chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
            if not chat_settings:
                chat_settings = ChatSettings(user_id=current_user.id)
                db.session.add(chat_settings)
                db.session.commit()
            
            messages = [
                {"role": "system", "content": "Ets GarBotGPT, un assistent d'IA útil creat per xAI."},
                {"role": "user", "content": user_message}
            ]
            
            if regenerate:
                # Obtenir l'últim missatge per regenerar
                last_entry = ChatHistory.query.filter_by(user_id=current_user.id).order_by(ChatHistory.timestamp.desc()).first()
                if last_entry:
                    messages = [
                        {"role": "system", "content": "Ets GarBotGPT, un assistent d'IA útil creat per xAI."},
                        {"role": "user", "content": last_entry.message}
                    ]
            
            response = openai.chat.completions.create(
                model=chat_settings.model,
                messages=messages,
                temperature=chat_settings.temperature,
                max_tokens=chat_settings.max_tokens
            )
            ai_response = response.choices[0].message.content
            
            # Guardar a la base de dades (no guardar si és regeneració)
            if not regenerate:
                chat_entry = ChatHistory(user_id=current_user.id, message=user_message, response=ai_response)
                db.session.add(chat_entry)
            else:
                # Actualitzar l'última resposta
                last_entry.response = ai_response
            db.session.commit()
            
            return jsonify({'response': ai_response})
        except Exception as e:
            logger.error(f"Error en el xat: {str(e)}")
            return jsonify({'error': str(e)}), 500
    history = ChatHistory.query.filter_by(user_id=current_user.id).order_by(ChatHistory.timestamp.asc()).all()
    chat_settings = ChatSettings.query.filter_by(user_id=current_user.id).first()
    return render_template('chat.html', history=history, chat_settings=chat_settings, authenticated=current_user.is_authenticated)

@current_app.route('/clear_history', methods=['POST'])
@login_required
def clear_history():
    try:
        ChatHistory.query.filter_by(user_id=current_user.id).delete()
        db.session.commit()
        logger.info(f"Historial de xat esborrat per l'usuari {current_user.username}")
        return jsonify({'success': True})
    except Exception as e:
        logger.error(f"Error esborrant l'historial: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@current_app.route('/export_history', methods=['GET'])
@login_required
def export_history():
    try:
        history = ChatHistory.query.filter_by(user_id=current_user.id).order_by(ChatHistory.timestamp.asc()).all()
        output = io.StringIO()
        for entry in history:
            output.write(f"[{entry.timestamp}] Tu: {entry.message}\n")
            output.write(f"[{entry.timestamp}] GarBotGPT: {entry.response}\n\n")
        output.seek(0)
        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8')),
            mimetype='text/plain',
            as_attachment=True,
            download_name='historial_xat.txt'
        )
    except Exception as e:
        logger.error(f"Error exportant l'historial: {str(e)}")
        flash('Error exportant l\'historial del xat', 'danger')
        return redirect(url_for('chat'))

@current_app.route('/update_theme', methods=['POST'])
@login_required
def update_theme():
    try:
        data = request.json
        theme = data.get('theme')
        if theme not in ['light', 'dark']:
            return jsonify({'success': False, 'error': 'Tema invàlid'}), 400
        current_user.theme = theme
        db.session.commit()
        logger.info(f"Tema actualitzat a {theme} per l'usuari {current_user.username}")
        return jsonify({'success': True})
    except Exception as e:
        logger.error(f"Error actualitzant el tema: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500