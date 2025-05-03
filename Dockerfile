FROM python:3.9-slim

WORKDIR /app

# Instalar las dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente de la aplicación
COPY . .

# Exponer el puerto (esto es solo informativo, Render usará un puerto dinámico)
EXPOSE 8080

# Ejecutar la aplicación con gunicorn, usando el puerto proporcionado por Render
CMD ["gunicorn", "--bind", "0.0.0.0:$PORT", "app:app"]
