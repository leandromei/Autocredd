// Teste de visibilidade dos campos de formulário
// Execute este script no console do navegador na página de criação de agentes

console.log("🧪 TESTE DE VISIBILIDADE DOS CAMPOS");
console.log("=====================================");

function testFieldVisibility() {
    const fields = document.querySelectorAll('input, textarea, select');
    let totalFields = fields.length;
    let visibleFields = 0;
    
    console.log(`📊 Total de campos encontrados: ${totalFields}`);
    
    fields.forEach((field, index) => {
        const style = window.getComputedStyle(field);
        const color = style.color;
        const bgColor = style.backgroundColor;
        const textFillColor = style.webkitTextFillColor;
        
        console.log(`📝 Campo ${index + 1}:`, {
            tag: field.tagName,
            type: field.type || 'N/A',
            color: color,
            backgroundColor: bgColor,
            webkitTextFillColor: textFillColor,
            visible: color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent'
        });
        
        if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
            visibleFields++;
        }
    });
    
    console.log(`✅ Campos visíveis: ${visibleFields}/${totalFields}`);
    
    if (visibleFields === totalFields) {
        console.log("🎉 TODOS OS CAMPOS ESTÃO VISÍVEIS!");
        return true;
    } else {
        console.log("⚠️ Alguns campos podem estar com problemas de visibilidade");
        return false;
    }
}

// Executar teste
const result = testFieldVisibility();

// Testar especificamente inputs em modais
console.log("\n🎭 TESTE ESPECÍFICO DE MODAIS");
console.log("============================");

const modalInputs = document.querySelectorAll('.fixed input, [role="dialog"] input');
console.log(`🎯 Inputs em modais encontrados: ${modalInputs.length}`);

modalInputs.forEach((input, index) => {
    const style = window.getComputedStyle(input);
    console.log(`Modal Input ${index + 1}:`, {
        color: style.color,
        backgroundColor: style.backgroundColor,
        webkitTextFillColor: style.webkitTextFillColor
    });
});

// Funções de ajuda
window.forceFixAllInputs = function() {
    console.log("🔧 FORÇANDO CORREÇÃO DE TODOS OS INPUTS");
    
    const allInputs = document.querySelectorAll('input, textarea, select');
    allInputs.forEach(input => {
        input.style.color = '#000000';
        input.style.backgroundColor = '#ffffff';
        input.style.webkitTextFillColor = '#000000';
    });
    
    console.log(`✅ Corrigidos ${allInputs.length} campos`);
};

console.log("\n🛠️ FUNÇÕES DISPONÍVEIS:");
console.log("- testFieldVisibility() - Testar visibilidade novamente");
console.log("- forceFixAllInputs() - Forçar correção de todos os inputs");

if (result) {
    console.log("\n🎉 CORREÇÃO APLICADA COM SUCESSO!");
} else {
    console.log("\n⚠️ Execute forceFixAllInputs() se necessário");
} 