from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.config import Config
import logging
import time
from sqlalchemy.exc import OperationalError
from sqlalchemy import inspect

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    
    # Importar modelos antes de crear tablas
    from app.models import User, ChatHistory
    
    # Crear tablas dentro del contexto de la aplicación con reintentos
    with app.app_context():
        # Depurar tablas registradas
        logger.info("Tablas registradas en SQLAlchemy: %s", db.metadata.tables.keys())
        
        max_retries = 5
        retry_count = 0
        while retry_count < max_retries:
            try:
                logger.info("Intentando conectar y crear tablas...")
                # Verificar conexión
                db.session.execute("SELECT 1")
                logger.info("Conexión a la base de datos exitosa.")
                
                # Crear tablas
                db.create_all()
                logger.info("Tablas creadas exitosamente.")
                
                # Verificar tablas creadas
                inspector = inspect(db.engine)
                created_tables = inspector.get_table_names()
                logger.info("Tablas presentes en la base de datos: %s", created_tables)
                
                if 'user' not in created_tables or 'chat_history' not in created_tables:
                    logger.error("No se encontraron las tablas esperadas ('user', 'chat_history').")
                    raise Exception("Fallo al crear tablas necesarias.")
                
                break
            except (OperationalError, Exception) as e:
                retry_count += 1
                logger.warning(f"Error al conectar o crear tablas (intento {retry_count}/{max_retries}): {str(e)}")
                if retry_count == max_retries:
                    logger.error("No se pudo conectar con la base de datos o crear tablas después de varios intentos.")
                    raise
                time.sleep(5)
        
        from app import routes
    
    return app

app = create_app()