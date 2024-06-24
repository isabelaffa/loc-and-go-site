document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            
            try {
                const response = await fetch('https://localhost:7265/api/UsuarioFuncionarios/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, senha })
                });

                if (response.ok) {
                    window.location.href = '/home/index.html';
                } else {
                    const errorData = await response.json();
                    alert(`Login falhou: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                alert('Erro ao fazer login. Por favor, tente novamente.');
            }
        });
    } else {
        console.error('Elemento com id "loginForm" não encontrado.');
    }
});
