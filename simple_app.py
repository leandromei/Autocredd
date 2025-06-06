#!/usr/bin/env python3
"""
🚀 AutoCred Railway - Backend + Frontend Integrado
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse, HTMLResponse
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

# HTML Frontend Self-Contained
AUTOCRED_HTML = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AutoCred - Sistema Completo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 40px;
            width: 90%;
            max-width: 1200px;
            text-align: center;
        }
        .logo {
            font-size: 2.5rem;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            font-size: 1.1rem;
            margin-bottom: 40px;
        }
        .status {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 30px;
        }
        .status-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
        }
        .status-item:last-child { border-bottom: none; }
        .status-good { color: #28a745; }
        .status-warning { color: #ffc107; }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .feature {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #667eea;
        }
        .feature h3 {
            color: #333;
            margin-bottom: 10px;
        }
        .feature p {
            color: #666;
            font-size: 0.9rem;
        }
        .btn {
            background: #667eea;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            margin: 10px;
            transition: all 0.3s ease;
        }
        .btn:hover {
            background: #5a6fd8;
            transform: translateY(-2px);
        }
        .api-section {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid #eee;
        }
        .api-endpoint {
            background: #f1f3f4;
            padding: 12px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🚀 AutoCred</div>
        <div class="subtitle">Sistema Completo de Gestão - Railway Production</div>
        
        <div class="status">
            <div class="status-item">
                <span><strong>🖥️ Backend API</strong></span>
                <span class="status-good">✅ Online</span>
            </div>
            <div class="status-item">
                <span><strong>💻 Frontend Interface</strong></span>
                <span class="status-good">✅ Carregado</span>
            </div>
            <div class="status-item">
                <span><strong>📱 WhatsApp API</strong></span>
                <span class="status-warning">⚡ Modo Simulado</span>
            </div>
            <div class="status-item">
                <span><strong>🌐 Ambiente</strong></span>
                <span class="status-good">🏗️ Railway</span>
            </div>
        </div>

        <div class="features">
            <div class="feature">
                <h3>📊 Dashboard</h3>
                <p>Painel completo com métricas, gráficos e KPIs do sistema AutoCred</p>
            </div>
            <div class="feature">
                <h3>👥 Gestão de Leads</h3>
                <p>Controle total dos prospects, conversões e pipeline de vendas</p>
            </div>
            <div class="feature">
                <h3>📄 Contratos</h3>
                <p>Criação, assinatura digital e gestão completa de contratos</p>
            </div>
            <div class="feature">
                <h3>💬 WhatsApp Bot</h3>
                <p>Automação de mensagens e atendimento via WhatsApp</p>
            </div>
            <div class="feature">
                <h3>📈 Relatórios</h3>
                <p>Analytics avançados e relatórios detalhados de performance</p>
            </div>
            <div class="feature">
                <h3>🔧 Configurações</h3>
                <p>Personalização completa do sistema para suas necessidades</p>
            </div>
        </div>

        <div style="margin-top: 30px;">
            <button class="btn" onclick="testAPI()">🧪 Testar API</button>
            <button class="btn" onclick="testWhatsApp()">📱 Testar WhatsApp</button>
            <button class="btn" onclick="showEnvironment()">🔍 Ver Ambiente</button>
        </div>

        <div class="api-section">
            <h3>🔧 API Endpoints Disponíveis</h3>
            <div class="api-endpoint">GET /health - Status do sistema</div>
            <div class="api-endpoint">GET /api/environment - Informações do ambiente</div>
            <div class="api-endpoint">POST /api/evolution/instance/create - Criar instância WhatsApp</div>
            <div class="api-endpoint">GET /api/evolution/instances - Listar instâncias WhatsApp</div>
        </div>

        <div id="result" style="margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; display: none;">
            <h4>📋 Resultado:</h4>
            <pre id="result-content" style="text-align: left; overflow: auto; max-height: 300px;"></pre>
        </div>
    </div>

    <script>
        async function testAPI() {
            try {
                const response = await fetch('/health');
                const data = await response.json();
                showResult('Health Check', data);
            } catch (error) {
                showResult('Erro', { error: error.message });
            }
        }

        async function testWhatsApp() {
            try {
                const response = await fetch('/api/evolution/instance/create', { method: 'POST' });
                const data = await response.json();
                showResult('WhatsApp Instance', data);
            } catch (error) {
                showResult('Erro', { error: error.message });
            }
        }

        async function showEnvironment() {
            try {
                const response = await fetch('/api/environment');
                const data = await response.json();
                showResult('Environment Info', data);
            } catch (error) {
                showResult('Erro', { error: error.message });
            }
        }

        function showResult(title, data) {
            const resultDiv = document.getElementById('result');
            const resultContent = document.getElementById('result-content');
            resultContent.textContent = JSON.stringify(data, null, 2);
            resultDiv.style.display = 'block';
            resultDiv.scrollIntoView({ behavior: 'smooth' });
        }

        // Auto-load environment info on page load
        window.addEventListener('load', showEnvironment);
    </script>
</body>
</html>"""

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
    # Always serve the self-contained HTML interface
    print(f"🎯 Servindo interface AutoCred self-contained")
    return HTMLResponse(content=AUTOCRED_HTML, status_code=200)

@app.get("/health")
async def health():
    return {"status": "healthy", "environment": "railway", "message": "AutoCred funcionando perfeitamente! 🚀"}

@app.get("/api/environment")
async def get_environment():
    return {
        "environment": "railway",
        "status": "active",
        "message": "Backend funcionando perfeitamente!",
        "frontend": "self_contained",
        "frontend_path": "inline_html",
        "version": "2.0.0",
        "features": [
            "Dashboard Completo",
            "Gestão de Leads", 
            "Contratos Digitais",
            "WhatsApp Bot (Simulado)",
            "Relatórios Avançados"
        ]
    }

@app.post("/api/evolution/instance/create")
async def create_instance():
    return {
        "success": True,
        "message": "Instância WhatsApp criada com sucesso (modo simulado)",
        "instance": {
            "name": "autocred_whatsapp",
            "status": "connected",
            "qr_code": "simulado_railway",
            "config_version": "2.3000.1023204200"
        }
    }

@app.get("/api/evolution/instances")
async def list_instances():
    return {
        "instances": [
            {
                "name": "autocred_whatsapp",
                "status": "connected",
                "created_at": "2025-06-06T14:15:00Z",
                "config_version": "2.3000.1023204200"
            }
        ],
        "total": 1
    }

# === CATCH-ALL PARA FRONTEND ROUTING ===

@app.get("/{path:path}")
async def serve_frontend(path: str):
    """
    Serve frontend for SPA routing - fallback to main interface
    """
    # For any path that doesn't match API routes, serve the main interface
    if not path.startswith("api/"):
        return HTMLResponse(content=AUTOCRED_HTML, status_code=200)
    
    # API not found
    return JSONResponse(
        status_code=404,
        content={"detail": f"API endpoint não encontrado: /{path}"}
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting AutoCred Complete on port {port}")
    print(f"💻 Frontend: Self-contained HTML interface")
    print(f"🌐 Environment: Railway Production")
    
    uvicorn.run(
        "simple_app:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    ) 