import os
from dotenv import load_dotenv

load_dotenv()  # Cargar variables de entorno desde el archivo .env

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')  # Render se encargará de proporcionarla
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')  # Clave de OpenAI cargada desde el entorno
