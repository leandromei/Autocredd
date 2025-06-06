#!/usr/bin/env python3
"""
�� AutoCred Railway - Backend + Frontend Integrado
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
import os
import uvicorn
from pathlib import Path

# Criar app FastAPI
app = FastAPI(
    title="AutoCred Railway Complete",
    description="Backend + Frontend integrado",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurar diretório do frontend
FRONTEND_DIR = Path("frontend_bolt/dist")

# Servir arquivos estáticos do frontend
if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")
    print("✅ Frontend estático configurado")
else:
    print("⚠️  Diretório do frontend não encontrado")

# === ROTAS DE API ===

@app.get("/")
async def root():
    # Servir o index.html do frontend se existir
    if FRONTEND_DIR.exists() and (FRONTEND_DIR / "index.html").exists():
        return FileResponse(FRONTEND_DIR / "index.html")
    else:
        return {"message": "AutoCred Railway Complete!", "status": "success"}

@app.get("/health")
async def health():
    return {"status": "healthy", "environment": "railway"}

@app.get("/api/environment")
async def get_environment():
    return {
        "environment": "railway",
        "status": "active",
        "message": "Backend funcionando perfeitamente!",
        "frontend": "integrated" if FRONTEND_DIR.exists() else "not_found"
    }

@app.post("/api/evolution/instance/create")
async def create_instance():
    return {
        "success": True,
        "message": "Instância WhatsApp criada com sucesso (modo simulado)",
        "instance": {
            "name": "test_instance",
            "status": "connected",
            "qr_code": "simulado"
        }
    }

@app.get("/api/evolution/instances")
async def list_instances():
    return {
        "instances": [
            {
                "name": "test_instance",
                "status": "connected"
            }
        ]
    }

# === CATCH-ALL PARA FRONTEND ROUTING ===

@app.get("/{path:path}")
async def serve_frontend(path: str):
    """
    Serve frontend files for SPA routing
    """
    if FRONTEND_DIR.exists():
        file_path = FRONTEND_DIR / path
        
        # Se o arquivo existe, serve ele
        if file_path.is_file():
            return FileResponse(file_path)
        
        # Se não existe, serve o index.html (SPA routing)
        if (FRONTEND_DIR / "index.html").exists():
            return FileResponse(FRONTEND_DIR / "index.html")
    
    # Fallback para API não encontrada
    return JSONResponse(
        status_code=404,
        content={"detail": "Página não encontrada"}
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting AutoCred Complete on port {port}")
    print(f"📁 Frontend directory: {FRONTEND_DIR}")
    print(f"🌐 Full stack application ready!")
    
    uvicorn.run(
        "simple_app:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    ) 