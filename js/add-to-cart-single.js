// Adiciona ao carrinho apenas 1 item, substituindo qualquer outro
function addToCart(productId) {
    // Busca o produto pelo id em ebooks ou products
    let produto = null;
    if (window.ebooks) {
        produto = window.ebooks.find(e => e.id === productId);
    }
    if (!produto && window.products) {
        produto = window.products.find(p => p.id === productId);
    }
    if (!produto) return;

    // Sempre sobrescreve o carrinho com apenas 1 item
    const cart = [{ id: produto.id, quantity: 1 }];
    // Usa a função de persistência do cart.js se disponível
    if (window.CartModule && typeof window.CartModule.saveCart === 'function') {
        window.CartModule.saveCart(cart);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    // Atualiza badge do carrinho
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    } else {
        var badge = document.querySelector('.cart-count');
        if (badge) badge.textContent = '1';
    }
    showNotification('Produto adicionado ao carrinho!', 'success');
}
