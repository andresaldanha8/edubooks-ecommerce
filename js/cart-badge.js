// Atualiza o badge do carrinho na navegação
function updateCartBadge() {
    var badge = document.querySelector('.cart-count');
    if (!badge) return;
    // Sempre 1 item, pois só permitimos 1 ebook no carrinho
    badge.textContent = '1';
}

// Atualiza badge ao carregar a página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCartBadge);
} else {
    updateCartBadge();
}
