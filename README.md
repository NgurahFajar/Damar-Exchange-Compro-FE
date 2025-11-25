# Setup project

## Clone project
Gunakan perintah:

`git clone https://github.com/NgurahFajar/Damar-Exchange-Compro-FE.git`

Kemudian buka project di code editor

## Menjalankan Project

Install composer:

`npm i`

Gunakan perintah:

`npm run dev`

Secara default aplikasi akan berjalan di http://localhost:5173/

## Setup .env

Gunakan .env.testing saat development

```env

VITE_APP_NAME="Damar Exchange"
VITE_API_URL="http://127.0.0.1:8000/backend/public"
VITE_STORAGE_URL="http://127.0.0.1:8000/backend/storage/public"
VITE_API_TIMEOUT=30000
