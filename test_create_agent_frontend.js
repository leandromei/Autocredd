// Script para testar criação de agentes no console do navegador
// Execute este script no console da página de criação de agentes

console.log("🤖 TESTE DE CRIAÇÃO DE AGENTES");
console.log("====================================");

async function testCreateAgent() {
    try {
        console.log("1. 🔍 Testando conexão com backend...");
        
        // Verificar se personalidades estão carregando
        const personalitiesResponse = await fetch('/api/agents/personalities');
        const personalities = await personalitiesResponse.json();
        console.log("✅ Personalidades carregadas:", personalities.personalities.length);
        
        // Dados do agente teste
        const agentData = {
            name: "Agente Console Teste",
            description: "Agente criado via console para teste",
            personality_id: "friendly",
            custom_prompt: "Seja muito útil e responda com entusiasmo!"
        };
        
        console.log("2. 🚀 Criando agente...");
        console.log("Dados:", agentData);
        
        // Fazer requisição de criação
        const response = await fetch('/api/agents/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(agentData)
        });
        
        console.log("📡 Status da resposta:", response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log("✅ SUCESSO! Agente criado:", result);
            alert(`✅ Agente "${result.agent.name}" criado com sucesso!`);
            
            // Atualizar a página para ver o agente
            console.log("🔄 Recarregando página em 2 segundos...");
            setTimeout(() => window.location.reload(), 2000);
            
            return true;
        } else {
            const errorText = await response.text();
            console.error("❌ Erro na criação:", response.status, errorText);
            alert(`❌ Erro: ${response.status} - ${errorText}`);
            return false;
        }
        
    } catch (error) {
        console.error("❌ Erro de conexão:", error);
        alert(`❌ Erro de conexão: ${error.message}`);
        return false;
    }
}

// Função para testar o formulário atual na página
function testCurrentForm() {
    console.log("📝 TESTANDO FORMULÁRIO DA PÁGINA");
    
    // Preencher formulário se existir
    const nameInput = document.querySelector('input[type="text"]');
    const descriptionTextarea = document.querySelector('textarea');
    const personalitySelect = document.querySelector('select');
    const promptTextarea = document.querySelectorAll('textarea')[1];
    
    if (nameInput && descriptionTextarea && personalitySelect && promptTextarea) {
        console.log("📝 Preenchendo formulário...");
        
        nameInput.value = "Agente Formulário Teste";
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        descriptionTextarea.value = "Descrição do agente de teste";
        descriptionTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        
        personalitySelect.value = "friendly";
        personalitySelect.dispatchEvent(new Event('change', { bubbles: true }));
        
        promptTextarea.value = "Seja útil e educado em todas as interações";
        promptTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        
        console.log("✅ Formulário preenchido!");
        console.log("➡️ Agora clique no botão 'Criar Agente'");
        
        // Destacar o botão de criar
        const createButton = document.querySelector('button[type="submit"]');
        if (createButton) {
            createButton.style.border = "3px solid #ff0000";
            createButton.style.animation = "blink 1s infinite";
            console.log("🔴 Botão 'Criar Agente' destacado em vermelho");
        }
    } else {
        console.log("❌ Formulário não encontrado na página");
        console.log("ℹ️ Certifique-se de que o modal de criação está aberto");
    }
}

// Executar teste
console.log("🎯 FUNÇÕES DISPONÍVEIS:");
console.log("- testCreateAgent() - Criar agente via API diretamente");
console.log("- testCurrentForm() - Preencher formulário da página");
console.log("- Teste automático em 3 segundos...");

// Executar teste automático
setTimeout(() => {
    console.log("🚀 Executando teste automático...");
    testCreateAgent();
}, 3000); 