// Cole este código no console do navegador (F12) e pressione Enter
console.log('🔐 Testando Login Frontend AutoCred');

// Testar health check primeiro
fetch('/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Health check:', d))
  .catch(e => console.error('❌ Health check falhou:', e));

// Testar login
const formData = new FormData();
formData.append('username', 'admin@autocred.com');
formData.append('password', 'admin123');

fetch('/api/token', {
    method: 'POST',
    body: formData
})
.then(r => {
    console.log('📊 Status do login:', r.status);
    return r.json();
})
.then(d => {
    console.log('📝 Response:', d);
    if (d.access_token) {
        localStorage.setItem('autocred-token', d.access_token);
        console.log('✅ Token salvo! Recarregando página...');
        setTimeout(() => location.reload(), 1000);
    } else {
        console.error('❌ Sem token na resposta');
    }
})
.catch(e => console.error('❌ Erro no login:', e)); 