// ===================================
// EDUBOOKS KIDS - FILTROS E BUSCA
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initFilters();
});

function initFilters() {
    // Busca
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Busca em tempo real (debounced)
        searchInput.addEventListener('input', debounce(function() {
            if (this.value.length >= 2 || this.value.length === 0) {
                performSearch();
            }
        }, 500));
    }
    
    // Filtro de categoria
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            if (window.ProductsModule) {
                window.ProductsModule.filterByCategory(this.value);
            }
        });
    }
    
    // Filtro de preço
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', function() {
            if (window.ProductsModule) {
                window.ProductsModule.filterByPrice(this.value);
            }
        });
    }
    
    // Ordenação
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            if (window.ProductsModule) {
                window.ProductsModule.sortProducts(this.value);
            }
        });
    }
}

function performSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput && window.ProductsModule) {
        window.ProductsModule.searchProducts(searchInput.value);
    }
}

// Limpa todos os filtros
function clearAllFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    if (sortFilter) sortFilter.value = 'name';
    
    // Recarrega todos os produtos
    if (window.ProductsModule) {
        const container = document.getElementById('products-grid');
        if (container) {
            container.innerHTML = window.ProductsModule.ebooks.map(ebook => createProductCard(ebook)).join('');
        }
    }
}

window.FiltersModule = {
    clearAllFilters,
    performSearch
};