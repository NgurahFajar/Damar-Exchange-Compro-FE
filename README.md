# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Setup project

### Clone project
Gunakan perintah:

`git clone https://github.com/NgurahFajar/Damar-Exchange-Compro-FE.git`

Kemudian buka project di code editor

### Menjalankan Project

Gunakan perintah:

`npm run dev`

Secara default aplikasi akan berjalan di http://localhost:5173/

### Setup .env

Gunakan .env.testing saat development

```env

VITE_APP_NAME="Damar Exchange"
VITE_API_URL="http://127.0.0.1:8000/backend/public"
VITE_STORAGE_URL="http://127.0.0.1:8000/backend/storage"
VITE_API_TIMEOUT=30000
