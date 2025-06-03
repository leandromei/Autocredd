// Script para testar visibilidade dos campos no console do navegador
// Cole este código no console (F12) e pressione Enter

console.log("🔍 TESTE DE VISIBILIDADE DOS CAMPOS");
console.log("="*50);

// Função para verificar estilos dos inputs
function checkInputStyles() {
    console.log("📝 Verificando estilos dos campos de input...");
    
    // Aguardar o modal aparecer
    setTimeout(() => {
        const inputs = document.querySelectorAll('input[type="text"], textarea, select');
        
        if (inputs.length === 0) {
            console.log("❌ Nenhum campo encontrado. Abra o modal 'Criar Novo Agente' primeiro!");
            return;
        }
        
        inputs.forEach((input, index) => {
            const styles = window.getComputedStyle(input);
            const textColor = styles.color;
            const backgroundColor = styles.backgroundColor;
            const placeholder = input.getAttribute('placeholder') || input.tagName;
            
            console.log(`${index + 1}. Campo: ${placeholder}`);
            console.log(`   Cor do texto: ${textColor}`);
            console.log(`   Cor de fundo: ${backgroundColor}`);
            
            // Verificar se o texto está visível
            if (textColor === 'rgb(255, 255, 255)' || textColor === '#ffffff' || textColor === 'white') {
                console.log("   ⚠️ PROBLEMA: Texto está branco!");
                // Corrigir automaticamente
                input.style.color = '#111827';
                input.style.backgroundColor = '#ffffff';
                console.log("   ✅ Corrigido automaticamente");
            } else {
                console.log("   ✅ Texto visível");
            }
            console.log("");
        });
    }, 1000);
}

// Função para forçar estilos corretos
function forceCorrectStyles() {
    console.log("🔧 Forçando estilos corretos...");
    
    const css = `
        input[type="text"], 
        textarea, 
        select {
            color: #111827 !important;
            background-color: #ffffff !important;
        }
        
        option {
            color: #111827 !important;
            background-color: #ffffff !important;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    
    console.log("✅ Estilos aplicados globalmente");
}

console.log("🎯 INSTRUÇÕES:");
console.log("1. Abra o modal 'Criar Novo Agente'");
console.log("2. Execute: checkInputStyles()");
console.log("3. Se houver problema, execute: forceCorrectStyles()");

// Disponibilizar as funções globalmente
window.checkInputStyles = checkInputStyles;
window.forceCorrectStyles = forceCorrectStyles;

console.log("📋 Funções disponíveis:");
console.log("- checkInputStyles() - Verificar estilos dos campos");
console.log("- forceCorrectStyles() - Forçar estilos corretos"); 