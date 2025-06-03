// Script para testar personalidades no console do navegador
// Cole este código no console (F12) e pressione Enter

console.log("🔍 TESTE DE PERSONALIDADES NO FRONTEND");
console.log("="*50);

// Verificar se as personalidades estão carregando
setTimeout(() => {
    console.log("📡 Testando fetch de personalidades...");
    
    fetch('/api/agents/personalities')
        .then(response => {
            console.log(`Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("✅ Personalidades recebidas:", data);
            
            if (data.personalities) {
                console.log(`📊 Total: ${data.personalities.length} personalidades`);
                data.personalities.forEach((p, index) => {
                    console.log(`${index + 1}. ${p.name} (${p.id})`);
                });
            } else {
                console.log("❌ Nenhuma personalidade encontrada na resposta");
            }
        })
        .catch(error => {
            console.error("❌ Erro:", error);
        });
}, 1000);

console.log("🎯 INSTRUÇÕES:");
console.log("1. Abra o modal 'Criar Novo Agente'");
console.log("2. Verifique se o campo mostra '(3 disponíveis)'");
console.log("3. Clique no dropdown de Personalidade");
console.log("4. Deve mostrar: Amigável, Profissional, Empático");

// Função para verificar estado atual do React (se disponível)
if (window.React) {
    console.log("✅ React detectado no window");
} else {
    console.log("ℹ️ React não encontrado no window global");
} 