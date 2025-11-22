// ===================================
// EDUBOOKS KIDS - CARRINHO
// ===================================

// Utilitário para obter status de login
function isUserLoggedInCart() {
    if (window.AuthModule && typeof window.AuthModule.isUserLoggedIn === 'function') {
        return window.AuthModule.isUserLoggedIn();
    }
    // fallback: tenta acessar diretamente
    return !!(localStorage.getItem('userData') || sessionStorage.getItem('userData'));
}

// Funções de persistência do carrinho
function getCart() {
    let cartStr;
    if (isUserLoggedInCart()) {
        cartStr = localStorage.getItem('cart');
    } else {
        cartStr = sessionStorage.getItem('cart');
    }
    try {
        return cartStr ? JSON.parse(cartStr) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    if (isUserLoggedInCart()) {
        localStorage.setItem('cart', JSON.stringify(cart));
    } else {
        sessionStorage.setItem('cart', JSON.stringify(cart));
    }
}

function clearCart() {
    if (isUserLoggedInCart()) {
        localStorage.removeItem('cart');
    } else {
        sessionStorage.removeItem('cart');
    }
}

// Carrega itens do carrinho na página
function loadCartItems() {
    const cart = getCart();
    const emptyCart = document.getElementById('empty-cart');
    const cartItems = document.getElementById('cart-items');
    const tableBody = document.getElementById('cart-table-body');
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartItems) cartItems.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartItems) cartItems.style.display = 'block';
    
    if (tableBody) {
        tableBody.innerHTML = cart.map(item => {
            const ebook = getEbookById(item.id);
            if (!ebook) return '';
            
            return `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="width: 60px; height: 60px; border-radius: 8px; overflow: hidden; background: linear-gradient(135deg, #ff6b35, #f7931e); display: flex; align-items: center; justify-content: center;">
                                ${ebook.image && ebook.image.startsWith('images/') 
                                    ? `<img src="${ebook.image}" alt="${ebook.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentNode.innerHTML='<div style=\\'font-size:1.5rem;color:white\\'>${ebook.fallbackEmoji || '📖'}</div>'">`
                                    : `<div style="font-size: 1.5rem; color: white;">${ebook.fallbackEmoji || ebook.image}</div>`
                                }
                            </div>
                            <div>
                                <strong>${ebook.name}</strong>
                                <br>
                                <small style="color: #666;">${ebook.ageRange} • ${ebook.downloadFormats.join(', ')}</small>
                            </div>
                        </div>
                    </td>
                    <td><strong>${formatPrice(ebook.price)}</strong></td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <button class="btn-quantity" onclick="updateQuantity(${item.id}, ${item.quantity - 1})" 
                                    ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                            <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                            <button class="btn-quantity" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </td>
                    <td><strong>${formatPrice(ebook.price * item.quantity)}</strong></td>
                    <td>
                        <button class="btn btn-secondary" onclick="removeFromCart(${item.id})" 
                                style="padding: 8px 12px; font-size: 0.9rem;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    updateCartSummary();
}

// Atualiza quantidade do item
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        loadCartItems(); // Recarrega a página do carrinho
    }
}

// Atualiza resumo do carrinho
function updateCartSummary() {
    const cart = getCart();
    let subtotal = 0;
    
    cart.forEach(item => {
        const ebook = getEbookById(item.id);
        if (ebook) {
            subtotal += ebook.price * item.quantity;
        }
    });
    
    const total = subtotal;
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (totalEl) totalEl.textContent = formatPrice(total);
}

// Busca ebook por ID
function getEbookById(id) {
    // Usa a função do products.js ou dados locais
    if (window.ProductsModule && window.ProductsModule.ebooks) {
        return window.ProductsModule.ebooks.find(ebook => ebook.id === id);
    }
    
    // Dados locais como fallback
    const localEbooks = [
        {
            id: 1,
            name: "Aprendendo com Alegria",
            price: 1.00,
            image: "images/img01.png",
            fallbackEmoji: "📖",
            ageRange: "4-10 anos",
            downloadFormats: ["PDF"]
        },
        {
            id: 2,
            name: "Alfabeto Bíblico",
            price: 1.00,
            image: "images/img02.png",
            fallbackEmoji: "🔤",
            ageRange: "3-8 anos",
            downloadFormats: ["PDF"]
        },
        {
            id: 3,
            name: "Alfabeto Bíblico Infantil",
            price: 1.00,
            image: "images/img03.png",
            fallbackEmoji: "🌈",
            ageRange: "2-6 anos",
            downloadFormats: ["PDF"]
        },
        {
            id: 4,
            name: "Complete os Nomes dos Animais",
            price: 1.00,
            image: "images/img04.png",
            fallbackEmoji: "🐼",
            ageRange: "4-8 anos",
            downloadFormats: ["PDF"]
        }
    ];
    
    return localEbooks.find(ebook => ebook.id === id);
}

// Limpa carrinho
function clearCartItems() {
    if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
        clearCart();
        loadCartItems();
    }
}

// Calcula frete (simulado)
function calculateShipping() {
    const cepInput = document.getElementById('cep-input');
    const shippingResult = document.getElementById('shipping-result');
    
    if (!cepInput || !shippingResult) return;
    
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        shippingResult.innerHTML = '<p style="color: red;">CEP inválido</p>';
        return;
    }
    
    // Simula cálculo
    shippingResult.innerHTML = '<p style="color: blue;">Calculando...</p>';
    
    setTimeout(() => {
        shippingResult.innerHTML = `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 10px;">
                <p><strong>✅ Ebooks Digitais - Download Imediato</strong></p>
                <p>• Sem frete - Download após pagamento</p>
                <p>• Entrega: Instantânea por email</p>
                <p>• Formatos: PDF e EPUB disponíveis</p>
            </div>
        `;
    }, 1000);
}

// Finalizar compra
function proceedToCheckout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!', 'error');
        return;
    }
    
    // Simula processo de checkout
    showNotification('Redirecionando para pagamento...', 'info');
    
    setTimeout(() => {
        // Foco em apenas 1 livro: pega o primeiro item do carrinho
        const firstItem = cart.length > 0 ? [cart[0]] : [];
        const checkoutData = {
            items: firstItem,
            total: firstItem.length > 0 ? (getEbookById(firstItem[0].id).price * firstItem[0].quantity) : 0,
            timestamp: new Date().toISOString()
        };
        // Salva dados do checkout
        localStorage.setItem('checkout', JSON.stringify(checkoutData));
        // Redireciona para página de checkout
        window.location.href = 'checkout.html';
    }, 1000);
}

// Calcula total do carrinho
function calculateCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => {
        const ebook = getEbookById(item.id);
        return total + (ebook ? ebook.price * item.quantity : 0);
    }, 0);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Carrega carrinho se estiver na página do carrinho
    if (document.getElementById('cart-items')) {
        loadCartItems();
        
        // Botão limpar carrinho
        const clearBtn = document.getElementById('clear-cart');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearCartItems);
        }
        
        // Botão calcular frete
        const calculateBtn = document.getElementById('calculate-shipping');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculateShipping);
        }
        
        // Máscara CEP
        const cepInput = document.getElementById('cep-input');
        if (cepInput) {
            cepInput.addEventListener('input', function() {
                formatCEP(this);
            });
        }
        
        // Botão checkout
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', proceedToCheckout);
        }
    }
});

// Estilos para botões de quantidade
const quantityStyles = `
    .btn-quantity {
        background: #f8f9fa;
        border: 1px solid #ddd;
        color: #333;
        width: 30px;
        height: 30px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .btn-quantity:hover:not(:disabled) {
        background: #ff6b35;
        color: white;
        border-color: #ff6b35;
    }
    
    .btn-quantity:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

// Adiciona estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = quantityStyles;
document.head.appendChild(styleSheet);

// Exporta funções
window.CartModule = {
    loadCartItems,
    updateQuantity,
    clearCartItems,
    calculateShipping,
    proceedToCheckout
};