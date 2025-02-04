#!/bin/bash
# install.sh - Instala dependencias, configura el entorno y construye la aplicación

# Variables globales
REPO_URL="https://github.com/ErickinSegura/Turings.git"
APP_DIR="/var/www/turings"
NODE_VERSION="18"    # Versión de Node.js

# Colores rainbow para las barras de carga
RAINBOW_COLORS=(
    "\e[38;5;196m"  # rojo
    "\e[38;5;208m"  # naranja
    "\e[38;5;226m"  # amarillo
    "\e[38;5;46m"   # verde
    "\e[38;5;27m"   # azul
    "\e[38;5;93m"   # índigo
    "\e[38;5;201m"  # violeta
)
NC="\e[0m"  # Sin color

########################################
# Funciones de impresión
########################################

# Encabezado en blanco (sin efecto arcoíris)
print_header() {
    clear
    local header=(
"███████████                       ███                             "
"░█░░░███░░░█                      ░░░                              "
"░   ░███  ░  █████ ████ ████████  ████  ████████    ███████  █████ "
"    ░███    ░░███ ░███ ░░███░░███░░███ ░░███░░███  ███░░███ ███░░  "
"    ░███     ░███ ░███  ░███ ░░░  ░███  ░███ ░███ ░███ ░███░░█████ "
"    ░███     ░███ ░███  ░███      ░███  ░███ ░███ ░███ ░███ ░░░░███"
"    █████    ░░████████ █████     █████ ████ █████░░███████ ██████ "
"   ░░░░░      ░░░░░░░░ ░░░░░     ░░░░░ ░░░░ ░░░░░  ░░░░░███░░░░░░  "
"                                                   ███ ░███        "
"                                                  ░░██████         "
"                                                   ░░░░░░          "
    )
    for line in "${header[@]}"; do
        # Encabezado en blanco (sin color adicional)
        echo -e "$line"
    done
    echo -e "\n\e[1;32mInstalador de la plataforma Turings\e[0m"
    echo -e "\e[90mVersión: 1.0\e[0m\n"
}

print_step() {
    # Usamos azul brillante para los mensajes de paso
    echo -e "\e[1;34m» $1\e[0m"
}
print_success() {
    echo -e "\e[1;32m✓ $1\e[0m"
}
print_error() {
    echo -e "\e[1;31m✗ Error: $1\e[0m"
}

########################################
# Función para generar barra de progreso
########################################
generate_rainbow_bar() {
    # Parámetros: $1 = número de caracteres "rellenados" (fill)
    #              $2 = longitud total de la barra
    local fill="$1"
    local total="$2"
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
# Función de ejecución con progreso real
########################################
# El comando que se ejecute debe emitir líneas con un porcentaje (XX%)
# o, en caso contrario, se simulará el avance basándose en el tiempo.
#
# Uso:
#   run_command "Mensaje" "comando a ejecutar"
########################################

run_command() {
    local message="$1"
    shift
    local cmd="$@"
    local bar_length=50
    local percent=0
    local start_time
    start_time=$(date +%s)
    local fallback_triggered=0

    # Creamos un FIFO temporal para capturar la salida
    local fifo
    fifo=$(mktemp -u)
    mkfifo "$fifo"

    # Ejecutamos el comando redirigiendo su salida (stdout y stderr) al FIFO
    ( eval "$cmd" 2>&1 > /dev/null ) > "$fifo" &
    local cmd_pid=$!

    # Mientras se esté ejecutando el comando, leemos línea a línea el FIFO
    while IFS= read -r line; do
        if [[ $line =~ ([0-9]{1,3})% ]]; then
            percent=${BASH_REMATCH[1]}
            fallback_triggered=0
        else
            # Si no se detecta porcentaje y ya pasaron 5 segundos, se activa el modo fallback
            local now; now=$(date +%s)
            if (( now - start_time > 5 )); then
                fallback_triggered=1
                # Simulación de avance en un lapso total de 30 segundos
                percent=$(( ((now - start_time) * 100) / 30 ))
                (( percent > 99 )) && percent=99
            fi
        fi
        # Calcular el número de “#” a mostrar en la barra
        local fill=$(( percent * bar_length / 100 ))
        # Se genera la barra de progreso arcoíris
        local bar
        bar=$(generate_rainbow_bar "$fill" "$bar_length")
        # Se imprime la línea de progreso
        printf "\r\e[36m%s: [%s] %d%%\e[0m" "$message" "$bar" "$percent"
    done < "$fifo"

    wait "$cmd_pid"
    rm "$fifo"
    # Se imprime la barra completada al 100%
    local full_bar
    full_bar=$(generate_rainbow_bar "$bar_length" "$bar_length")
    printf "\r\e[32m%s: [%s] 100%% Done\e[0m\n" "$message" "$full_bar"
}

########################################
# Funciones adicionales
########################################

# Detecta la distribución (para saber qué gestor de paquetes usar)
detect_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        DISTRO=$ID
    else
        print_error "No se pudo detectar la distribución de Linux."
        exit 1
    fi
}

# Crea el archivo .env pidiendo los datos de Firebase
create_env_file() {
    print_step "Creando archivo .env para la configuración de Firebase..."
    read -p "Ingresa REACT_APP_FIREBASE_API_KEY: " API_KEY
    read -p "Ingresa REACT_APP_FIREBASE_AUTH_DOMAIN: " AUTH_DOMAIN
    read -p "Ingresa REACT_APP_FIREBASE_PROJECT_ID: " PROJECT_ID
    read -p "Ingresa REACT_APP_FIREBASE_STORAGE_BUCKET: " STORAGE_BUCKET
    read -p "Ingresa REACT_APP_FIREBASE_MESSAGING_SENDER_ID: " MESSAGING_SENDER_ID
    read -p "Ingresa REACT_APP_FIREBASE_APP_ID: " APP_ID
    read -p "Ingresa REACT_APP_FIREBASE_MEASUREMENT_ID: " MEASUREMENT_ID

    cat <<EOF > "$APP_DIR/.env"
REACT_APP_FIREBASE_API_KEY=$API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=$AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=$PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=$MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=$APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID=$MEASUREMENT_ID
EOF
    print_success "Archivo .env creado en $APP_DIR/.env"
}

########################################
# INICIO DEL SCRIPT DE INSTALACIÓN
########################################

print_header
detect_distro

# Se han quitado las actualizaciones del sistema

print_step "Instalando dependencias básicas (curl, git)..."
if [[ "$DISTRO" == "ubuntu" || "$DISTRO" == "debian" ]]; then
    run_command "Instalando curl y git" "sudo apt install -y curl git"
elif [[ "$DISTRO" == "arch" || "$DISTRO" == "manjaro" ]]; then
    run_command "Instalando curl y git" "sudo pacman -S --noconfirm curl git"
else
    print_error "Distribución no soportada: $DISTRO"
    exit 1
fi

print_step "Instalando Node.js y npm..."
if [[ "$DISTRO" == "ubuntu" || "$DISTRO" == "debian" ]]; then
    run_command "Instalando Node.js" "curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | sudo -E bash - && sudo apt install -y nodejs"
elif [[ "$DISTRO" == "arch" || "$DISTRO" == "manjaro" ]]; then
    run_command "Instalando Node.js y npm" "sudo pacman -S --noconfirm nodejs npm"
else
    print_error "Distribución no soportada: $DISTRO"
    exit 1
fi

print_step "Verificando la instalación de Node.js y npm..."
node_version=$(node -v 2>/dev/null)
npm_version=$(npm -v 2>/dev/null)
if [ -z "$node_version" ] || [ -z "$npm_version" ]; then
    print_error "Node.js o npm no se instalaron correctamente."
    exit 1
fi
print_success "Node.js versión: $node_version"
print_success "npm versión: $npm_version"

########################################
# Gestión del repositorio
########################################

# Si se detecta un repositorio (carpeta .git) en el directorio actual:
if [ -d ".git" ]; then
    # Si el directorio actual no es el de destino, se mueven (copian) los archivos
    if [ "$(pwd)" != "$APP_DIR" ]; then
        print_step "Repositorio detectado en $(pwd). Moviendo archivos a $APP_DIR..."
        sudo mkdir -p "$APP_DIR"
        # Usamos rsync para copiar todo, incluidos los archivos ocultos
        rsync -av --progress ./ "$APP_DIR/"
        cd "$APP_DIR" || { print_error "No se pudo cambiar al directorio $APP_DIR"; exit 1; }
        print_success "Archivos movidos a $APP_DIR"
    else
        print_step "Repositorio ya se encuentra en $APP_DIR."
    fi
else
    # Si no se detecta un repositorio, se asume que se debe clonar en APP_DIR
    print_step "Creando directorio para la aplicación..."
    sudo mkdir -p "$APP_DIR"
    sudo chown -R "$USER":"$USER" "$APP_DIR"
    print_success "Directorio creado en $APP_DIR"

    print_step "Clonando el repositorio desde GitHub..."
    run_command "Clonando repositorio" "git clone --progress $REPO_URL $APP_DIR"
    cd "$APP_DIR" || { print_error "No se pudo cambiar al directorio $APP_DIR"; exit 1; }
fi

create_env_file

print_step "Instalando dependencias del proyecto..."
run_command "Instalando dependencias" "npm install"

print_step "Construyendo la aplicación de React..."
run_command "Construyendo la aplicación" "npm run build"

print_step "Instalando 'serve' para servir la aplicación..."
run_command "Instalando serve" "sudo npm install -g serve"

echo ""
echo -e "\e[1;32m¡La instalación se completó con éxito!\e[0m"
echo -e "\e[36mAhora puedes usar el script start.sh para iniciar la aplicación.\e[0m"
echo ""
