# admin-front

Frontend administrativo de Move360 construido con React, TypeScript y Vite.

## Requisitos

- Node.js 20+
- npm

## Configuración local

Este proyecto requiere un archivo `.env` en la raíz. Puedes usar `.env.example` como base.

Variables requeridas:

- `VITE_API_URL`: URL base del backend
- `VITE_FIREBASE_API_KEY`: API key de Firebase
- `VITE_FIREBASE_AUTH_DOMAIN`: dominio de autenticación de Firebase
- `VITE_FIREBASE_PROJECT_ID`: id del proyecto de Firebase
- `VITE_FIREBASE_STORAGE_BUCKET`: bucket de storage de Firebase
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: sender id de Firebase
- `VITE_FIREBASE_APP_ID`: app id de Firebase

Ejemplo:

```env
VITE_API_URL=http://localhost:8080
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
npm run storybook
npm run build-storybook
```
