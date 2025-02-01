# Turings 🪙

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Plataforma de gamificación educativa para la gestión de la moneda virtual "Turings" en entornos académicos.

![Captura de Turings](https://raw.githubusercontent.com/ErickinSegura/Turings/master/.github/README_IMG/ss.png)

## 🚀 Características principales
- Sistema de gestión de la moneda virtual "Turings"
- Canje de Turings por beneficios académicos:
  - Extensiones de tiempo para proyectos
  - Bonificaciones en calificaciones
  - Otros beneficios personalizables
- Panel de control para administración docente
- Historial transaccional detallado
- Sistema de seguimiento de progreso estudiantil

## 🛠 Tecnologías utilizadas
- **Frontend:** 
  - React + JavaScript
  - Tailwind CSS
  - Componentes UI con Shadcn
- **Backend:** 
  - Firebase Authentication
  - Firestore Database

## 📦 Instalación

### Requisitos previos
- Node.js v16+
- npm v8+
- Cuenta de Firebase

### Pasos para la configuración
1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/turings.git
cd turings
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar Firebase:

- Crea un proyecto en Firebase Console
- Configura los servicios de Authentication y Firestore
- Crea un archivo .env.local en la raíz del proyecto con tus credenciales:

```env

REACT_APP_FIREBASE_API_KEY=tu-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-domino.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-bucket.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
REACT_APP_FIREBASE_APP_ID=tu-app-id
```
4. Iniciar la aplicación:

```bash
npm run start
```
 
## 🤝 Cómo contribuir

- Haz un fork del proyecto
- Crea una rama para tu feature (git checkout -b feature/nueva-funcionalidad)
- Realiza tus cambios y commitea (git commit -m 'Agrega nueva funcionalidad')
- Haz push a la rama (git push origin feature/nueva-funcionalidad)
- Abre un Pull 

## 🐛 Reportar un problema

Si encuentras algún error o tienes una sugerencia para mejorar la plataforma, sigue estos pasos:

1. **Verifica si ya existe el problema**  
   Busca en los [issues existentes](https://github.com/ErickinSegura/Turings/issues) para evitar duplicados

2. **Crea un nuevo issue**  
   Usa la plantilla adecuada:
   - [Reporte de error](https://github.com/ErickinSegura/Turings/issues/new?template=bug_report.md)
   - [Solicitud de función](https://github.com/ErickinSegura/Turings/new?template=feature_request.md)

3. **Proporciona detalles completos**:
   - Descripción clara del problema
   - Pasos para reproducirlo
   - Comportamiento esperado vs actual
   - Capturas de pantalla (si aplica)
   - Entorno (navegador, SO, versión de la app)

**Ejemplo de buen reporte**:  
```markdown
## Descripción
[Explicación clara del problema]

## Pasos para reproducir
1. Ir a '...'
2. Hacer clic en '....'
3. Ver error en '....'

## Comportamiento esperado
[Lo que debería suceder]

## Ambiente
- Dispositivo: [ej. iPhone 12]
- SO: [ej. iOS 15.4]
- Navegador: [ej. Chrome 101]
- Versión de la app: [ej. 1.2.0]
``` 

### ⚠️ Importante:

- Usa títulos descriptivos (ej: "Error al canjear Turings en móvil")

- Etiqueta correctamente el issue (bug, mejora, feature, etc.)

- Los issues no constructivos o sin suficiente información serán cerrados

El equipo revisará tu reporte y responderá en un plazo máximo de 48 horas. ¡Gracias por ayudar a mejorar Turings! 🚀
