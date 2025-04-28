#!/bin/bash
# start-https.sh - Inicia la aplicación utilizando 'serve' con HTTPS autofirmado

# Variables
APP_DIR="/var/www/turings"
PORT="8081"  # Puerto en el que se servirá la aplicación
SSL_DIR="$APP_DIR/ssl"  # Directorio para guardar los certificados
SSL_CERT="$SSL_DIR/cert.pem"  # Ruta al certificado SSL
SSL_KEY="$SSL_DIR/key.pem"    # Ruta a la clave privada

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
# Función para generar certificados SSL
########################################

generate_ssl_certificates() {
    print_step "Generando certificados SSL autofirmados..."

    # Crear directorio para certificados si no existe
    mkdir -p "$SSL_DIR"

    # Generar certificado autofirmado
    if openssl req -x509 -newkey rsa:2048 -keyout "$SSL_KEY" -out "$SSL_CERT" -days 365 -nodes \
        -subj "/C=ES/ST=Estado/L=Ciudad/O=TuringsApp/OU=IT/CN=$(hostname -f)" 2>/dev/null; then
        print_success "Certificados SSL generados correctamente en $SSL_DIR"
        return 0
    else
        print_error "No se pudieron generar los certificados SSL"
        return 1
    fi
}

########################################
# Verificar instalación de openssl
########################################

check_openssl() {
    if ! command -v openssl &> /dev/null; then
        print_error "OpenSSL no está instalado. Instalando..."
        if command -v apt &> /dev/null; then
            sudo apt update && sudo apt install -y openssl
        elif command -v yum &> /dev/null; then
            sudo yum install -y openssl
        else
            print_error "No se puede instalar OpenSSL automáticamente. Por favor, instálalo manualmente."
            return 1
        fi
    fi
    return 0
}

########################################
# Inicio del script
########################################

clear

print_step "Preparando para iniciar la aplicación con HTTPS en el puerto $PORT..."

# Cambiar al directorio de la aplicación
cd "$APP_DIR" || { print_error "No se pudo cambiar al directorio $APP_DIR"; exit 1; }

# Verificar si openssl está instalado
check_openssl || { print_error "OpenSSL es necesario para generar certificados"; exit 1; }

# Verificar si los certificados ya existen o generarlos
if [ ! -f "$SSL_CERT" ] || [ ! -f "$SSL_KEY" ]; then
    generate_ssl_certificates || { print_error "No se pudo configurar HTTPS"; exit 1; }
fi

# Verificar si serve tiene la opción ssl-cert
if ! serve -h | grep -q "\-\-ssl-cert"; then
    print_error "El comando 'serve' no soporta la opción SSL. Actualizando..."
    npm install -g serve@latest
fi

# Inicia la aplicación con SSL en segundo plano y redirige los logs a app.log
print_step "Iniciando la aplicación segura..."
nohup serve -s build -l "$PORT" --ssl-cert "$SSL_CERT" --ssl-key "$SSL_KEY" > app.log 2>&1 &
# Guarda el PID en un archivo para detenerla posteriormente
echo $! > serve.pid

# Barra de progreso con estilo "arcoíris"
bar_length=50
printf "\n"
for ((i=0; i<=bar_length; i++)); do
    percent=$(( i * 100 / bar_length ))
    bar=$(generate_rainbow_bar "$i" "$bar_length")
    printf "\r${CYAN}Iniciando la aplicación segura (HTTPS): [${bar}] ${percent}%%${NC}"
    sleep 0.05
done
printf "\n"

print_success "La aplicación se está ejecutando con HTTPS en el puerto $PORT."
echo -e "${CYAN}Puedes verificar los logs en ${APP_DIR}/app.log${NC}"
echo -e "${GREEN}La aplicación está disponible en: https://$(hostname -f):$PORT${NC}"
echo -e "${YELLOW}Nota: Como el certificado es autofirmado, los navegadores mostrarán una advertencia de seguridad.${NC}"
echo -e "${YELLOW}      Puedes aceptar el riesgo y continuar para acceder a tu aplicación.${NC}"