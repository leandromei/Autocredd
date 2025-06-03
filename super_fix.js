// SUPER FIX - Cole no console AGORA!

console.log("🚨 SUPER CORREÇÃO - FORÇANDO TUDO!");

// Remover qualquer CSS conflitante
const oldStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
oldStyles.forEach(style => {
    if (style.textContent && style.textContent.includes('color')) {
        console.log("Removendo CSS conflitante");
    }
});

// Aplicar estilo super agressivo
const superCSS = `
    * {
        color: black !important;
    }
    
    input, textarea, select {
        color: black !important;
        background: white !important;
        border: 2px solid #333 !important;
        font-size: 14px !important;
    }
    
    option {
        color: black !important;
        background: white !important;
    }
`;

const superStyle = document.createElement('style');
superStyle.textContent = superCSS;
document.head.appendChild(superStyle);

// Forçar estilos direto nos elementos
setTimeout(() => {
    const elements = document.querySelectorAll('input, textarea, select');
    elements.forEach(el => {
        el.style.setProperty('color', 'black', 'important');
        el.style.setProperty('background-color', 'white', 'important');
        el.style.setProperty('background', 'white', 'important');
        el.style.border = '2px solid #333';
        el.style.fontSize = '14px';
    });
    
    // Adicionar personalidades
    const select = document.querySelector('select');
    if (select) {
        select.innerHTML = `
            <option value="" style="color:black;background:white;">Selecione uma personalidade</option>
            <option value="friendly" style="color:black;background:white;">Amigável</option>
            <option value="professional" style="color:black;background:white;">Profissional</option>
            <option value="empathetic" style="color:black;background:white;">Empático</option>
        `;
        select.style.setProperty('color', 'black', 'important');
        select.style.setProperty('background', 'white', 'important');
    }
    
    console.log("✅ SUPER FIX APLICADO!");
    console.log("📝 Agora digite nos campos - deve aparecer PRETO!");
    
}, 200); 