FROM python:3.9-slim

WORKDIR /app

# Copiar el archivo requirements.txt y luego instalar las dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente de la aplicación
COPY . .

# Configurar variables de entorno para Flask
ENV FLASK_APP=app
ENV FLASK_ENV=production

# Exponer el puerto (Heroku asignará un puerto dinámico)
EXPOSE 8080

# Ejecutar la aplicación con gunicorn y usar el puerto proporcionado por Heroku
CMD ["gunicorn", "--bind", "0.0.0.0:$PORT", "app:app"]
