#!/bin/bash
# stop.sh - Detiene la aplicación iniciada con 'serve'

# Variables (deben coincidir con las definidas en start.sh)
APP_DIR="/var/www/turings"

# Funciones para mensajes
print_step() {
    echo -e "\e[1;33m» $1\e[0m"
}
print_success() {
    echo -e "\e[1;32m✓ $1\e[0m"
}
print_error() {
    echo -e "\e[1;31m✗ Error: $1\e[0m"
}

cd "$APP_DIR" || { print_error "No se pudo cambiar al directorio $APP_DIR"; exit 1; }

if [ -f "serve.pid" ]; then
    PID=$(cat serve.pid)
    print_step "Deteniendo la aplicación (PID: $PID)..."
    kill "$PID" && print_success "Aplicación detenida." || print_error "No se pudo detener la aplicación."
    rm -f serve.pid
else
    print_error "No se encontró el archivo serve.pid. ¿Está la aplicación en ejecución?"
fi
