// ===================================
// EDUBOOKS KIDS - MAIN JAVASCRIPT
// ===================================

// Aguarda o DOM estar carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('EduBooks Kids - Site carregado!');
    
    // Inicializa componentes
    initMobileMenu();
    initSmoothScroll();
    initAnimations();
    updateCartCount();
});

// MENU MOBILE
function initMobileMenu() {
    // Adiciona funcionalidade ao menu mobile se necessário
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        // Código para menu mobile será adicionado aqui
    }
}

// SCROLL SUAVE
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ANIMAÇÕES
function initAnimations() {
    // Intersection Observer para animações
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });

    // Observa elementos para animação
    const animateElements = document.querySelectorAll('.product-card, .category-card, .value-card');
    animateElements.forEach(el => observer.observe(el));
}

// ATUALIZA CONTADOR DO CARRINHO
function updateCartCount() {
    const cart = getCart();
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// OBTÉM ITENS DO CARRINHO
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

// SALVA CARRINHO
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// ADICIONA ITEM AO CARRINHO
function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart(cart);
    showNotification('Item adicionado ao carrinho!', 'success');
}

// REMOVE ITEM DO CARRINHO
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    showNotification('Item removido do carrinho!', 'info');
}

// LIMPA CARRINHO
function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
    showNotification('Carrinho limpo!', 'info');
}

// NOTIFICAÇÕES
function showNotification(message, type = 'info') {
    // Cria elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos inline para a notificação
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'
    });
    
    document.body.appendChild(notification);
    
    // Anima entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// FORMATAÇÃO DE PREÇO
function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

// MÁSCARA PARA CEP
function formatCEP(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/^(\d{5})(\d{3}).*/, '$1-$2');
    input.value = value;
}

// VALIDAÇÃO DE EMAIL
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// SCROLL TO TOP
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// DETECTA SE É DISPOSITIVO MOBILE
function isMobile() {
    return window.innerWidth <= 768;
}

// DEBOUNCE FUNCTION
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// EXPORTA FUNÇÕES GLOBAIS
window.EduBooksKids = {
    addToCart,
    removeFromCart,
    clearCart,
    getCart,
    formatPrice,
    showNotification,
    scrollToTop,
    isMobile
};