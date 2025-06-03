// Script para testar login no console do navegador
// Coloque isso no console do navegador na página do frontend

console.log("🔐 Testando Login AutoCred");

async function testLogin() {
    try {
        // Limpar localStorage
        localStorage.clear();
        console.log("📝 localStorage limpo");
        
        // Testar health check
        console.log("1. 📡 Testando health check...");
        const healthResponse = await fetch('http://localhost:8001/api/health');
        const healthData = await healthResponse.json();
        console.log("✅ Health check:", healthData);
        
        // Preparar dados de login
        const formData = new FormData();
        formData.append('username', 'admin@autocred.com');
        formData.append('password', 'admin123');
        
        // Fazer login
        console.log("2. 🔑 Fazendo login...");
        const loginResponse = await fetch('http://localhost:8001/api/token', {
            method: 'POST',
            body: formData
        });
        
        console.log("Login status:", loginResponse.status);
        
        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            console.log("✅ Login successful:", loginData);
            
            // Salvar token
            localStorage.setItem('token', loginData.access_token);
            console.log("💾 Token salvo no localStorage");
            
            // Testar endpoint protegido
            console.log("3. 🔒 Testando endpoint protegido...");
            const meResponse = await fetch('http://localhost:8001/api/me', {
                headers: {
                    'Authorization': `Bearer ${loginData.access_token}`
                }
            });
            
            if (meResponse.ok) {
                const userData = await meResponse.json();
                console.log("✅ Endpoint protegido OK:", userData);
                
                // Recarregar a página para ver se o token persiste
                console.log("🔄 Recarregando página em 2 segundos...");
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
                
            } else {
                console.error("❌ Erro no endpoint protegido:", await meResponse.text());
            }
            
        } else {
            console.error("❌ Erro no login:", await loginResponse.text());
        }
        
    } catch (error) {
        console.error("❌ Erro geral:", error);
    }
}

// Executar teste
testLogin();

// Função para verificar token atual
function checkCurrentToken() {
    const token = localStorage.getItem('token');
    console.log("Token atual:", token ? token.substring(0, 50) + "..." : "Nenhum");
    return token;
}

// Função para limpar tudo e tentar novamente
function resetAndTryAgain() {
    localStorage.clear();
    sessionStorage.clear();
    console.log("🧹 Tudo limpo, tentando novamente...");
    testLogin();
}

console.log("🎯 Funções disponíveis:");
console.log("- checkCurrentToken() - Verificar token atual");
console.log("- resetAndTryAgain() - Limpar tudo e tentar novamente");
console.log("- testLogin() - Executar teste de login"); 