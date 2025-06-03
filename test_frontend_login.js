// Script para testar login do frontend no console do navegador
console.log("🔐 Testando Login Frontend AutoCred");

async function testFrontendLogin() {
    try {
        console.log("📝 Limpando localStorage...");
        localStorage.clear();
        
        // Testar health check primeiro
        console.log("1. 📡 Testando health check...");
        const healthResponse = await fetch('/api/health');
        const healthData = await healthResponse.json();
        console.log("✅ Health check:", healthData);
        
        // Preparar dados de login como o frontend faria
        const loginData = {
            username: 'admin@autocred.com',
            password: 'admin123'
        };
        
        // Testar endpoint de login como JSON (método moderno)
        console.log("2. 🔑 Testando login com JSON...");
        const jsonResponse = await fetch('/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });
        
        console.log("Login JSON status:", jsonResponse.status);
        
        if (jsonResponse.ok) {
            const loginResult = await jsonResponse.json();
            console.log("✅ Login JSON successful:", loginResult);
            
            // Salvar token
            localStorage.setItem('token', loginResult.access_token);
            console.log("💾 Token salvo:", loginResult.access_token);
            
        } else {
            console.error("❌ Login JSON falhou:", await jsonResponse.text());
            
            // Tentar com FormData (método original)
            console.log("3. 🔑 Tentando login com FormData...");
            const formData = new FormData();
            formData.append('username', 'admin@autocred.com');
            formData.append('password', 'admin123');
            
            const formResponse = await fetch('/api/token', {
                method: 'POST',
                body: formData
            });
            
            console.log("Login FormData status:", formResponse.status);
            
            if (formResponse.ok) {
                const formResult = await formResponse.json();
                console.log("✅ Login FormData successful:", formResult);
                
                // Salvar token
                localStorage.setItem('token', formResult.access_token);
                console.log("💾 Token salvo:", formResult.access_token);
                
            } else {
                console.error("❌ Login FormData falhou:", await formResponse.text());
            }
        }
        
        // Testar endpoint protegido se temos token
        const token = localStorage.getItem('token');
        if (token) {
            console.log("4. 🔒 Testando endpoint protegido...");
            const meResponse = await fetch('/api/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (meResponse.ok) {
                const userData = await meResponse.json();
                console.log("✅ Endpoint protegido OK:", userData);
                
                console.log("🎉 Login completo! Redirecionando...");
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
                
            } else {
                console.error("❌ Erro no endpoint protegido:", await meResponse.text());
            }
        }
        
    } catch (error) {
        console.error("❌ Erro geral:", error);
    }
}

// Executar teste
testFrontendLogin();

console.log("🎯 Para executar novamente: testFrontendLogin()"); 