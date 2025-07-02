from flask import Flask, redirect, url_for, request
from flask_sqlalchemy import SQLAlchemy
from app.config import Config
from dotenv import load_dotenv
import logging
import time
from sqlalchemy.exc import OperationalError
from sqlalchemy import inspect
import os

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    
    # Load MAINTENANCE_MODE from environment variables
    MAINTENANCE_MODE = os.getenv('MAINTENANCE_MODE', 'False').lower() == 'true'
    
    # Middleware to check maintenance mode
    @app.before_request
    def check_maintenance():
        # Skip maintenance check for the maintenance route itself
        if request.path == '/maintenance':
            return
        # Optionally, allow admin routes (uncomment and adapt if needed)
        # if request.path.startswith('/admin') and current_user.is_authenticated and current_user.is_admin:
        #     return
        if MAINTENANCE_MODE:
            logger.info(f"Maintenance mode active, redirecting to /maintenance from {request.path}")
            return redirect(url_for('maintenance'))
    
    # Import models before creating tables
    from app.models import User, ChatHistory, ChatSettings, Document
    
    # Create tables within the application context with retries
    with app.app_context():
        # Debug registered tables
        logger.info("Tablas registradas en SQLAlchemy: %s", db.metadata.tables.keys())
        
        max_retries = 5
        retry_count = 0
        while retry_count < max_retries:
            try:
                logger.info("Intentando conectar y crear tablas...")
                # Verify connection
                db.session.execute("SELECT 1")
                logger.info("Conexión a la base de datos exitosa.")
                
                # Create tables
                db.create_all()
                logger.info("Tablas creadas exitosamente.")
                
                # Verify created tables
                inspector = inspect(db.engine)
                created_tables = inspector.get_table_names()
                logger.info("Tablas presentes en la base de datos: %s", created_tables)
                
                expected_tables = {'user', 'chat_history', 'chat_settings', 'document'}
                if not expected_tables.issubset(created_tables):
                    logger.error("No se encontraron las tablas esperadas: %s", expected_tables)
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
