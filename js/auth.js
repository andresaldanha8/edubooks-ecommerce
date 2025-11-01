// ===================================
// EDUBOOKS KIDS - AUTENTICAÇÃO
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initAuthForms();
});

function initAuthForms() {
    // Tabs de login/registro
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginTab && registerTab && loginForm && registerForm) {
        loginTab.addEventListener('click', function() {
            switchTab('login');
        });
        
        registerTab.addEventListener('click', function() {
            switchTab('register');
        });
    }
    
    // Formulário de login
    const loginFormElement = document.getElementById('login-form-element');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', handleLogin);
    }
    
    // Formulário de registro
    const registerFormElement = document.getElementById('register-form-element');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', handleRegister);
    }
}

function switchTab(tab) {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('remember-me');
    
    // Validações básicas
    if (!email || !password) {
        showNotification('Por favor, preencha todos os campos!', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Email inválido!', 'error');
        return;
    }
    
    // Simula processo de login
    showNotification('Fazendo login...', 'info');
    
    setTimeout(() => {
        // Simula login bem-sucedido
        const userData = {
            email: email,
            name: 'Usuário EduBooks',
            loginTime: new Date().toISOString(),
            rememberMe: !!rememberMe
        };
        
        if (rememberMe) {
            localStorage.setItem('userData', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('userData', JSON.stringify(userData));
        }
        
        showNotification('Login realizado com sucesso!', 'success');
        
        // Redireciona após 2 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
    }, 1500);
}

function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');
    const acceptTerms = formData.get('accept-terms');
    const newsletter = formData.get('newsletter');
    
    // Validações
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Email inválido!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('As senhas não coincidem!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('A senha deve ter pelo menos 6 caracteres!', 'error');
        return;
    }
    
    if (!acceptTerms) {
        showNotification('Você deve aceitar os Termos de Uso!', 'error');
        return;
    }
    
    // Simula processo de registro
    showNotification('Criando sua conta...', 'info');
    
    setTimeout(() => {
        // Simula registro bem-sucedido
        const userData = {
            name: name,
            email: email,
            phone: phone,
            newsletter: !!newsletter,
            registeredAt: new Date().toISOString()
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        showNotification('Conta criada com sucesso!', 'success');
        
        // Redireciona após 2 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
    }, 2000);
}

// Verifica se usuário está logado
function isUserLoggedIn() {
    return !!(localStorage.getItem('userData') || sessionStorage.getItem('userData'));
}

// Obtém dados do usuário
function getUserData() {
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Logout
function logout() {
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
    showNotification('Logout realizado com sucesso!', 'success');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// Atualiza interface baseado no status de login
function updateAuthUI() {
    const userIcon = document.querySelector('.user-icon');
    const userData = getUserData();
    
    if (userData && userIcon) {
        userIcon.title = `Logado como: ${userData.name}`;
        // Adiciona indicador visual de usuário logado
        userIcon.style.color = '#28a745';
    }
}

// Inicializa interface de auth ao carregar página
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
    
    // Se estiver na página de login e já logado, redireciona
    if (window.location.pathname.includes('login.html') && isUserLoggedIn()) {
        showNotification('Você já está logado!', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
});

// Exporta funções
window.AuthModule = {
    isUserLoggedIn,
    getUserData,
    logout,
    updateAuthUI
};