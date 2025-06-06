#!/usr/bin/env python3
"""
🚀 AutoCred Railway - Backend + Frontend Integrado
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

# Configurar diretório do frontend - múltiplas tentativas
POSSIBLE_FRONTEND_DIRS = [
    Path("frontend_bolt/dist"),
    Path("./frontend_bolt/dist"),
    Path("/app/frontend_bolt/dist"),
    Path("dist"),
    Path("./dist")
]

FRONTEND_DIR = None
for dir_path in POSSIBLE_FRONTEND_DIRS:
    if dir_path.exists() and (dir_path / "index.html").exists():
        FRONTEND_DIR = dir_path
        print(f"✅ Frontend encontrado em: {dir_path}")
        break

if FRONTEND_DIR:
    try:
        app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")
        print(f"✅ Arquivos estáticos configurados: {FRONTEND_DIR}")
    except Exception as e:
        print(f"⚠️ Erro ao configurar arquivos estáticos: {e}")
        FRONTEND_DIR = None
else:
    print("❌ Nenhum diretório de frontend encontrado nos caminhos:")
    for dir_path in POSSIBLE_FRONTEND_DIRS:
        print(f"   - {dir_path} (existe: {dir_path.exists()})")

# === ROTAS DE API ===

@app.get("/")
async def root():
    # Servir o index.html do frontend se existir
    if FRONTEND_DIR and (FRONTEND_DIR / "index.html").exists():
        print(f"🎯 Servindo frontend de: {FRONTEND_DIR / 'index.html'}")
        return FileResponse(FRONTEND_DIR / "index.html")
    else:
        print("📄 Servindo fallback JSON (frontend não encontrado)")
        return {"message": "AutoCred Railway - Frontend não carregado", "status": "backend_only"}

@app.get("/health")
async def health():
    return {"status": "healthy", "environment": "railway"}

@app.get("/api/environment")
async def get_environment():
    return {
        "environment": "railway",
        "status": "active",
        "message": "Backend funcionando perfeitamente!",
        "frontend": "loaded" if FRONTEND_DIR else "not_found",
        "frontend_path": str(FRONTEND_DIR) if FRONTEND_DIR else "none"
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
    if FRONTEND_DIR:
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
        content={"detail": f"Página não encontrada: {path}", "frontend_available": FRONTEND_DIR is not None}
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting AutoCred Complete on port {port}")
    print(f"📁 Frontend directory: {FRONTEND_DIR}")
    print(f"🌐 Frontend status: {'✅ Loaded' if FRONTEND_DIR else '❌ Not found'}")
    
    uvicorn.run(
        "simple_app:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    ) 