# AutocredGold + Project Bolt Unified Package

## Structure
- `backend_autocred/` – original AutocredGold backend (FastAPI) including templates, static files, database migrations, etc.
- `frontend_bolt/`  – React + TypeScript + Vite frontend from Project Bolt.

## How to run locally

### Backend (FastAPI)
```bash
cd backend_autocred
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend (React/Vite)
```bash
cd frontend_bolt
npm install
npm run dev
```

The frontend is configured to run on port **5173** by default and the backend on **8000**.
During development, set up a proxy or configure CORS in the backend (already enabled in `core_security.py`).

## Next steps for Cursor AI

1. **Component Mapping** – Use `templates/` in `backend_autocred` as a reference for existing HTML views. Re‑implement these screens using components from `frontend_bolt/src/components`.
2. **API Integration** – All REST endpoints are declared in `backend_autocred/src/api_*`. Connect via Axios (configured in `frontend_bolt/src/lib/api.ts`).
3. **Build & Deploy** – On CI, build the React app with `npm run build`, then copy the generated `dist/` folder into `backend_autocred/static/` or have Nginx serve it directly (see `backend_autocred/nginx/`).

Feel free to rename folders if required.