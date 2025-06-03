// DIAGNÓSTICO COMPLETO E CORREÇÃO RADICAL

console.log("🔍 DIAGNÓSTICO COMPLETO DO PROBLEMA");
console.log("="*60);

function diagnoseAndFix() {
    // 1. Encontrar todos os inputs
    const inputs = document.querySelectorAll('input, textarea, select');
    console.log(`📊 ${inputs.length} campos encontrados`);
    
    if (inputs.length === 0) {
        console.log("❌ NENHUM CAMPO ENCONTRADO!");
        console.log("📝 Certifique-se que o modal 'Criar Novo Agente' está aberto");
        return;
    }
    
    // 2. Diagnosticar cada campo
    inputs.forEach((input, i) => {
        console.log(`\n${i+1}. CAMPO: ${input.tagName} - ${input.placeholder || input.type || 'sem placeholder'}`);
        
        const computed = window.getComputedStyle(input);
        console.log(`   🎨 Cor atual: ${computed.color}`);
        console.log(`   🎨 Fundo atual: ${computed.backgroundColor}`);
        console.log(`   🎨 Font-size: ${computed.fontSize}`);
        console.log(`   🎨 Display: ${computed.display}`);
        console.log(`   🎨 Visibility: ${computed.visibility}`);
        console.log(`   🎨 Opacity: ${computed.opacity}`);
        
        // Verificar estilos inline
        console.log(`   📝 Style inline: ${input.style.cssText || 'nenhum'}`);
        
        // 3. CORREÇÃO RADICAL - Substituir completamente o elemento
        const newInput = input.cloneNode(true);
        
        // Limpar TODOS os estilos
        newInput.removeAttribute('style');
        newInput.removeAttribute('class');
        
        // Aplicar estilos diretos e básicos
        newInput.style.cssText = `
            color: #000000 !important;
            background-color: #ffffff !important;
            background: #ffffff !important;
            border: 2px solid #333333 !important;
            padding: 8px !important;
            font-size: 16px !important;
            font-family: Arial, sans-serif !important;
            width: 100% !important;
            box-sizing: border-box !important;
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
        `;
        
        // Substituir o elemento
        input.parentNode.replaceChild(newInput, input);
        
        console.log(`   ✅ Campo ${i+1} substituído com estilos básicos`);
        
        // Se for select, adicionar as opções
        if (newInput.tagName === 'SELECT') {
            newInput.innerHTML = `
                <option value="" style="color:#000;background:#fff;">Selecione uma personalidade</option>
                <option value="friendly" style="color:#000;background:#fff;">Amigável</option>
                <option value="professional" style="color:#000;background:#fff;">Profissional</option>
                <option value="empathetic" style="color:#000;background:#fff;">Empático</option>
            `;
            console.log(`   📋 Opções adicionadas ao select`);
        }
        
        // Adicionar listener para verificar se o texto aparece
        newInput.addEventListener('input', function() {
            console.log(`✏️ Digitado no campo ${i+1}: "${this.value}"`);
        });
    });
    
    // 4. Aplicar CSS global super agressivo
    const ultimateCSS = `
        input, textarea, select {
            color: #000000 !important;
            background-color: #ffffff !important;
            background: #ffffff !important;
            border: 2px solid #333333 !important;
            font-size: 16px !important;
            font-family: Arial, sans-serif !important;
            opacity: 1 !important;
            visibility: visible !important;
        }
        
        option {
            color: #000000 !important;
            background-color: #ffffff !important;
        }
        
        /* Sobrescrever qualquer tema dark */
        .dark input, .dark textarea, .dark select,
        [data-theme="dark"] input, [data-theme="dark"] textarea, [data-theme="dark"] select {
            color: #000000 !important;
            background-color: #ffffff !important;
        }
    `;
    
    // Remover estilos antigos conflitantes
    document.querySelectorAll('style[id*="fix"], style[id*="emergency"]').forEach(s => s.remove());
    
    const style = document.createElement('style');
    style.id = 'ultimate-fix';
    style.textContent = ultimateCSS;
    document.head.appendChild(style);
    
    console.log("\n🎯 CORREÇÃO COMPLETA APLICADA!");
    console.log("📝 TESTE AGORA:");
    console.log("1. Digite 'TESTE' no primeiro campo");
    console.log("2. Se aparecer texto PRETO, funcionou!");
    console.log("3. Se não aparecer, execute: emergencyTest()");
}

// Função de teste de emergência
function emergencyTest() {
    console.log("🚨 TESTE DE EMERGÊNCIA");
    
    // Criar um input de teste simples
    const testInput = document.createElement('input');
    testInput.type = 'text';
    testInput.placeholder = 'TESTE - Digite aqui';
    testInput.style.cssText = `
        position: fixed !important;
        top: 50px !important;
        left: 50px !important;
        z-index: 99999 !important;
        color: red !important;
        background: yellow !important;
        border: 3px solid blue !important;
        font-size: 20px !important;
        padding: 10px !important;
    `;
    
    document.body.appendChild(testInput);
    testInput.focus();
    
    console.log("📝 Input de teste criado no canto superior esquerdo");
    console.log("📝 Digite nele para ver se o texto aparece");
    
    setTimeout(() => {
        document.body.removeChild(testInput);
        console.log("Input de teste removido");
    }, 10000);
}

// Disponibilizar funções
window.diagnoseAndFix = diagnoseAndFix;
window.emergencyTest = emergencyTest;

// Executar automaticamente
diagnoseAndFix();

console.log("\n🆘 FUNÇÕES DISPONÍVEIS:");
console.log("- diagnoseAndFix() - Diagnóstico completo");
console.log("- emergencyTest() - Teste com input simples"); 