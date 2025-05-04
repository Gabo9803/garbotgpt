import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    RATE_LIMIT = os.getenv('RATE_LIMIT', '200 per day;50 per hour')
    MAX_MESSAGE_LENGTH = 5000  # Máximo de caracteres por mensaje
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
    CACHE_TIMEOUT = 300  # 5 minutos para cacheo
    MAX_CONTEXT_MESSAGES = 10  # Número máximo de mensajes para contexto