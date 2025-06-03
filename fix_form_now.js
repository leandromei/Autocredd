// SCRIPT DE CORREÇÃO IMEDIATA - Cole no console (F12) agora mesmo!

console.log("🚨 CORREÇÃO IMEDIATA DO FORMULÁRIO");
console.log("="*50);

// 1. Forçar CSS correto imediatamente
function fixStyles() {
    console.log("🔧 Aplicando CSS emergencial...");
    
    const emergencyCSS = `
        /* Forçar visibilidade do texto */
        input, textarea, select {
            color: #000000 !important;
            background-color: #ffffff !important;
            border: 2px solid #d1d5db !important;
        }
        
        /* Garantir que options sejam visíveis */
        option {
            color: #000000 !important;
            background-color: #ffffff !important;
        }
        
        /* Específico para o modal */
        .fixed input, .fixed textarea, .fixed select {
            color: #000000 !important;
            background: white !important;
        }
    `;
    
    const style = document.createElement('style');
    style.id = 'emergency-fix';
    style.textContent = emergencyCSS;
    document.head.appendChild(style);
    console.log("✅ CSS aplicado");
}

// 2. Adicionar personalidades manualmente ao select
function addPersonalities() {
    console.log("👤 Adicionando personalidades ao dropdown...");
    
    const select = document.querySelector('select');
    if (!select) {
        console.log("❌ Select não encontrado");
        return;
    }
    
    // Limpar options existentes exceto o primeiro
    const firstOption = select.firstElementChild;
    select.innerHTML = '';
    if (firstOption) {
        select.appendChild(firstOption);
    }
    
    // Adicionar personalidades
    const personalities = [
        { id: 'friendly', name: 'Amigável' },
        { id: 'professional', name: 'Profissional' },
        { id: 'empathetic', name: 'Empático' }
    ];
    
    personalities.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.name;
        option.style.color = '#000000';
        option.style.backgroundColor = '#ffffff';
        select.appendChild(option);
    });
    
    console.log(`✅ ${personalities.length} personalidades adicionadas`);
}

// 3. Função para verificar se tudo está funcionando
function testForm() {
    console.log("🧪 Testando formulário...");
    
    const inputs = document.querySelectorAll('input, textarea, select');
    console.log(`📊 ${inputs.length} campos encontrados`);
    
    inputs.forEach((input, i) => {
        const styles = window.getComputedStyle(input);
        const name = input.placeholder || input.tagName || `Campo ${i+1}`;
        console.log(`${i+1}. ${name}: ${styles.color} / ${styles.backgroundColor}`);
        
        // Forçar cor se necessário
        if (styles.color === 'rgb(255, 255, 255)') {
            input.style.color = '#000000';
            input.style.backgroundColor = '#ffffff';
            console.log(`   ⚡ Cor forçada para ${name}`);
        }
    });
}

// 4. Executar todas as correções
function fixEverything() {
    console.log("🚀 Executando correção completa...");
    
    fixStyles();
    
    setTimeout(() => {
        addPersonalities();
        testForm();
        
        console.log("\n🎯 INSTRUÇÕES:");
        console.log("1. Clique nos campos e digite");
        console.log("2. O texto deve aparecer em PRETO");
        console.log("3. No dropdown deve ter: Amigável, Profissional, Empático");
        console.log("\n📱 Se ainda não funcionar, execute:");
        console.log("fixEverything()");
        
    }, 500);
}

// Disponibilizar globalmente
window.fixEverything = fixEverything;
window.fixStyles = fixStyles;
window.addPersonalities = addPersonalities;
window.testForm = testForm;

// Executar automaticamente
fixEverything();

console.log("\n🆘 FUNÇÕES DE EMERGÊNCIA:");
console.log("- fixEverything() - Corrige tudo");
console.log("- fixStyles() - Apenas CSS");
console.log("- addPersonalities() - Apenas personalidades");
console.log("- testForm() - Verificar status"); 