#!/bin/bash
# start.sh - Inicia la aplicación utilizando 'serve'

# Variables (deben coincidir con las definidas en install.sh)
APP_DIR="/var/www/turings"
PORT="3000"  # Puerto en el que se servirá la aplicación

# Colores y estilos
NC="\e[0m"
BOLD="\e[1m"
CYAN="\e[36m"
YELLOW="\e[1;33m"
GREEN="\e[1;32m"
RED="\e[1;31m"

# Colores rainbow para la barra de progreso
RAINBOW_COLORS=(
    "\e[38;5;196m"  # rojo
    "\e[38;5;208m"  # naranja
    "\e[38;5;226m"  # amarillo
    "\e[38;5;46m"   # verde
    "\e[38;5;27m"   # azul
    "\e[38;5;93m"   # índigo
    "\e[38;5;201m"  # violeta
)

########################################
# Funciones de impresión
########################################


print_step() {
    echo -e "${YELLOW}» $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ Error: $1${NC}"
}

########################################
# Función para generar barra de progreso
########################################

generate_rainbow_bar() {
    # Genera una barra de progreso coloreada: se colorea cada bloque
    # Parámetros: $1 = cantidad de bloques "rellenados", $2 = longitud total de la barra
    local fill=$1
    local total=$2
    local bar=""
    local i color_index
    for (( i=0; i<total; i++ )); do
        if (( i < fill )); then
            color_index=$(( i % ${#RAINBOW_COLORS[@]} ))
            bar+="${RAINBOW_COLORS[$color_index]}#${NC}"
        else
            bar+="–"
        fi
    done
    echo -ne "$bar"
}

########################################
# Inicio del script
########################################

clear

print_step "Iniciando la aplicación en el puerto $PORT..."

# Cambiar al directorio de la aplicación
cd "$APP_DIR" || { print_error "No se pudo cambiar al directorio $APP_DIR"; exit 1; }

# Inicia la aplicación en segundo plano y redirige los logs a app.log
nohup serve -s build -l "$PORT" > app.log 2>&1 &
# Guarda el PID en un archivo para detenerla posteriormente
echo $! > serve.pid

# Barra de progreso con estilo "arcoíris"
bar_length=50
printf "\n"
for ((i=0; i<=bar_length; i++)); do
    percent=$(( i * 100 / bar_length ))
    bar=$(generate_rainbow_bar "$i" "$bar_length")
    printf "\r${CYAN}Iniciando la aplicación: [${bar}] ${percent}%%${NC}"
    sleep 0.05
done
printf "\n"

print_success "La aplicación se está ejecutando en el puerto $PORT."
echo -e "${CYAN}Puedes verificar los logs en ${APP_DIR}/app.log${NC}"
