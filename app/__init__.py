from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache
from app.config import Config
import logging
import time
from sqlalchemy.exc import OperationalError
from sqlalchemy import inspect, text
import os

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

db = SQLAlchemy()
cache = Cache(config={'CACHE_TYPE': 'SimpleCache'})

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Validar DATABASE_URL
    if not app.config.get('DATABASE_URL'):
        logger.error("DATABASE_URL no está configurado en las variables de entorno.")
        raise ValueError("DATABASE_URL no está configurado.")
    
    # Crear directorio de uploads
    upload_folder = app.config.get('UPLOAD_FOLDER', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    logger.info(f"Directorio de uploads creado en: {upload_folder}")
    
    db.init_app(app)
    cache.init_app(app)
    
    # Importar modelos antes de crear tablas
    from app.models import User, ChatSettings, ChatHistory, MessageReaction
    
    # Crear tablas dentro del contexto de la aplicación con reintentos
    with app.app_context():
        logger.info("Tablas registradas en SQLAlchemy: %s", db.metadata.tables.keys())
        
        max_retries = 5
        retry_count = 0
        while retry_count < max_retries:
            try:
                logger.info("Intentando conectar y crear tablas...")
                db.session.execute(text('SELECT 1'))  # Consulta de prueba corregida
                logger.info("Conexión a la base de datos exitosa.")
                
                db.create_all()
                logger.info("Tablas creadas exitosamente.")
                
                inspector = inspect(db.engine)
                created_tables = inspector.get_table_names()
                logger.info("Tablas presentes en la base de datos: %s", created_tables)
                
                expected_tables = ['user', 'chat_settings', 'chat_history', 'message_reaction']
                for table in expected_tables:
                    if table not in created_tables:
                        logger.error(f"No se encontró la tabla esperada: {table}")
                        raise Exception(f"Fallo al crear la tabla {table}.")
                
                break
            except (OperationalError, Exception) as e:
                retry_count += 1
                logger.warning(f"Error al conectar o crear tablas (intento {retry_count}/{max_retries}): {str(e)}")
                if retry_count == max_retries:
                    logger.error("No se pudo conectar con la base de datos o crear tablas después de varios intentos.")
                    raise
                time.sleep(5)
        
        # Importar rutas después de crear tablas
        from app import routes
    
    return app

app = create_app()