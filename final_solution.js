// SOLUÇÃO DEFINITIVA - Cole no console agora!

console.log("🎯 SOLUÇÃO DEFINITIVA DO TEXTO INVISÍVEL");

// 1. Criar CSS com especificidade máxima
const definitiveCSS = `
    /* Especificidade máxima para sobrescrever QUALQUER CSS */
    html body div form div input:not([type="hidden"]),
    html body div form div textarea,
    html body div form div select,
    input[type="text"],
    input[type="email"],
    input[type="password"],
    textarea,
    select {
        color: #000000 !important;
        background-color: #ffffff !important;
        background: #ffffff !important;
        -webkit-text-fill-color: #000000 !important;
        text-shadow: none !important;
        opacity: 1 !important;
        font-size: 16px !important;
        border: 2px solid #333 !important;
        padding: 8px !important;
    }
    
    /* Forçar cor da seleção também */
    input::selection,
    textarea::selection {
        color: #000000 !important;
        background: #0066cc !important;
    }
    
    input::-moz-selection,
    textarea::-moz-selection {
        color: #000000 !important;
        background: #0066cc !important;
    }
    
    /* Options do select */
    option {
        color: #000000 !important;
        background: #ffffff !important;
        -webkit-text-fill-color: #000000 !important;
    }
    
    /* Sobrescrever QUALQUER tema */
    .dark *,
    [data-theme="dark"] *,
    [class*="dark"] *,
    [id*="dark"] * {
        color: #000000 !important;
        -webkit-text-fill-color: #000000 !important;
    }
`;

// 2. Remover TODOS os estilos existentes
document.querySelectorAll('style').forEach(style => {
    if (style.textContent.includes('color') || style.textContent.includes('background')) {
        style.disabled = true;
    }
});

// 3. Aplicar CSS definitivo
const style = document.createElement('style');
style.textContent = definitiveCSS;
document.head.appendChild(style);

// 4. Força nos elementos individuais
setTimeout(() => {
    document.querySelectorAll('input, textarea, select').forEach((el, i) => {
        // Limpar classes que podem causar problema
        el.className = '';
        
        // Aplicar estilo inline super específico
        el.style.setProperty('color', '#000000', 'important');
        el.style.setProperty('-webkit-text-fill-color', '#000000', 'important');
        el.style.setProperty('background-color', '#ffffff', 'important');
        el.style.setProperty('background', '#ffffff', 'important');
        el.style.setProperty('text-shadow', 'none', 'important');
        el.style.setProperty('opacity', '1', 'important');
        el.style.setProperty('font-size', '16px', 'important');
        el.style.setProperty('border', '2px solid #333', 'important');
        el.style.setProperty('padding', '8px', 'important');
        
        // Para selects, adicionar personalidades
        if (el.tagName === 'SELECT') {
            el.innerHTML = `
                <option value="" style="color:#000!important;background:#fff!important;">Selecione uma personalidade</option>
                <option value="friendly" style="color:#000!important;background:#fff!important;">Amigável</option>
                <option value="professional" style="color:#000!important;background:#fff!important;">Profissional</option>
                <option value="empathetic" style="color:#000!important;background:#fff!important;">Empático</option>
            `;
        }
        
        // Listener para monitorar digitação
        el.addEventListener('input', function() {
            console.log(`✏️ Campo ${i+1}: "${this.value}"`);
            // Re-aplicar cor após cada digitação
            this.style.setProperty('color', '#000000', 'important');
            this.style.setProperty('-webkit-text-fill-color', '#000000', 'important');
        });
        
        // Força cor a cada 100ms
        setInterval(() => {
            if (el.style.color !== 'rgb(0, 0, 0)') {
                el.style.setProperty('color', '#000000', 'important');
                el.style.setProperty('-webkit-text-fill-color', '#000000', 'important');
            }
        }, 100);
    });
    
    console.log("✅ SOLUÇÃO DEFINITIVA APLICADA!");
    console.log("📝 Digite agora - o texto DEVE aparecer em preto!");
    console.log("📝 Se ainda não funcionar, seu navegador pode ter extensões interferindo");
    
}, 200);

// 5. Função para aplicar cor manualmente
window.forceTextColor = function() {
    document.querySelectorAll('input, textarea, select').forEach(el => {
        el.style.color = '#000000';
        el.style.webkitTextFillColor = '#000000';
        el.style.background = '#ffffff';
    });
    console.log("Cor forçada manualmente!");
};

console.log("🔧 Se ainda não funcionar, execute: forceTextColor()");
console.log("🔧 Ou desative extensões do navegador temporariamente"); 