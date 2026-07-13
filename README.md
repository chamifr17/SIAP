# SIAP

Mobile-first Progressive Web Application for digitising Duty Officer movement and sick-report logbooks during ROTU/PALAPES training.

## Structure

- `frontend/` - React + Vite + TypeScript + Tailwind PWA
- `backend/` - FastAPI REST API with Supabase/PostgreSQL-ready settings

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

Create `frontend/.env` from `frontend/.env.example`.

For Vercel:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://your-render-api.onrender.com/api/v1`

## Backend

```powershell
cd backend
..\.venv\Scripts\python.exe -m pip install -r requirements.txt
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Create `backend/.env` from `backend/.env.example`.

For Render:

- Use `render.yaml`, or create a Web Service with root directory `backend`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `CORS_ORIGINS`
