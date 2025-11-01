// Array com os 8 ebooks que possuem capas reais
const ebooks = [
    {
        id: 1,
        name: "Aprendendo com Alegria",
        description: "Um ebook educativo que torna o aprendizado uma experiência divertida e envolvente para crianças.",
        price: 19.90,
        category: "escolares", 
        image: "images/img01.png",
        fallbackEmoji: "📚",
        features: ["Atividades interativas", "Aprendizado lúdico", "Desenvolvimento cognitivo", "Exercícios práticos"],
        downloadFormats: ["PDF"],
        ageRange: "4-8 anos"
    },
    {
        id: 2,
        name: "Alfabeto Bíblico",
        description: "Aprenda o alfabeto de forma criativa com versículos bíblicos e ilustrações encantadoras.",
        price: 16.90,
        category: "igreja",
        image: "images/img02.png",
        fallbackEmoji: "✝️",
        features: ["26 letras ilustradas", "Versículos bíblicos", "Atividades religiosas", "Memorização fácil"],
        downloadFormats: ["PDF"],
        ageRange: "3-7 anos"
    },
    {
        id: 3,
        name: "Brincando e Aprendendo",
        description: "Atividades lúdicas que combinam diversão e educação para o desenvolvimento infantil.",
        price: 22.90,
        category: "escolares",
        image: "images/img03.png",
        fallbackEmoji: "🎮",
        features: ["Jogos educativos", "Brincadeiras criativas", "Desenvolvimento motor", "Socialização"],
        downloadFormats: ["PDF"],
        ageRange: "4-10 anos"
    },
    {
        id: 4,
        name: "Coordenação Motora",
        description: "Exercícios especializados para desenvolver a coordenação motora fina e grossa das crianças.",
        price: 18.90,
        category: "escolares",
        image: "images/img04.png",
        fallbackEmoji: "🏃‍♀️",
        features: ["Exercícios motores", "Desenvolvimento físico", "Atividades progressivas", "Coordenação fina"],
        downloadFormats: ["PDF"],
        ageRange: "3-8 anos"
    },
    {
        id: 5,
        name: "Desenhos para Colorir",
        description: "Uma coleção especial de desenhos educativos para colorir, estimulando a criatividade infantil.",
        price: 14.90,
        category: "colorir",
        image: "images/img05.png",
        fallbackEmoji: "🎨",
        features: ["Desenhos variados", "Estimula criatividade", "Coordenação motora", "Relaxamento"],
        downloadFormats: ["PDF"],
        ageRange: "2-10 anos"
    },
    {
        id: 6,
        name: "Educação Infantil",
        description: "Material educativo completo com atividades diversificadas para o desenvolvimento integral da criança.",
        price: 26.90,
        category: "escolares",
        image: "images/img06.png",
        fallbackEmoji: "🎓",
        features: ["Currículo completo", "Atividades variadas", "Base educacional", "Desenvolvimento integral"],
        downloadFormats: ["PDF"],
        ageRange: "4-7 anos"
    },
    {
        id: 7,
        name: "Atividades Bíblicas",
        description: "Compilação completa de atividades bíblicas variadas para entretenimento e aprendizado cristão.",
        price: 23.90,
        category: "igreja",
        image: "images/img07.png",
        fallbackEmoji: "📚",
        features: ["Atividades variadas", "Aprendizado cristão", "Entretenimento educativo", "Desenvolvimento integral"],
        downloadFormats: ["PDF"],
        ageRange: "5-12 anos"
    },
    {
        id: 8,
        name: "Colorindo com Propósito",
        description: "Livro de colorir com desenhos que ensinam valores e propósitos através da arte e criatividade.",
        price: 14.90,
        category: "colorir",
        image: "images/img08.png",
        fallbackEmoji: "🎨",
        features: ["Desenhos educativos", "Valores importantes", "Desenvolvimento criativo", "Coordenação motora"],
        downloadFormats: ["PDF"],
        ageRange: "3-10 anos"
    }
];

// Carrega produtos na página inicial
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    // Pega os primeiros 4 produtos
    const featuredEbooks = ebooks.slice(0, 4);
    
    container.innerHTML = featuredEbooks.map(ebook => createProductCard(ebook)).join('');
}

// Carrega todos os produtos na página de produtos
function loadAllProducts() {
    const container = document.getElementById('products-grid');
    const loading = document.getElementById('loading');
    
    if (!container) return;

    // Simula carregamento
    setTimeout(() => {
        if (loading) loading.style.display = 'none';
        container.innerHTML = ebooks.map(ebook => createProductCard(ebook)).join('');
        
        // Adiciona event listeners aos botões
        addProductEventListeners();
    }, 500);
}

// Cria card do produto
function createProductCard(ebook) {
    const imageContent = ebook.image.startsWith('images/') 
        ? `<img src="${ebook.image}" alt="${ebook.name}" onerror="this.parentNode.innerHTML='<div style=\\'font-size:4rem;color:white\\'>${ebook.fallbackEmoji}</div>'">`
        : `<div style="font-size:4rem;color:white">${ebook.image}</div>`;
    
    return `
        <div class="product-card" data-category="${ebook.category}" data-price="${ebook.price}">
            <div class="product-image">
                ${imageContent}
            </div>
            <div class="product-info">
                <h3>${ebook.name}</h3>
                <p>${ebook.description}</p>
                <div class="product-price">${formatPrice(ebook.price)}</div>
                <div class="product-meta">
                    <small><i class="fas fa-child"></i> ${ebook.ageRange}</small>
                    <small><i class="fas fa-file-pdf"></i> ${ebook.downloadFormats.join(', ')}</small>
                </div>
                <div class="product-actions">
                    <button class="btn btn-secondary btn-small preview-btn" data-id="${ebook.id}">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                    <button class="btn btn-primary btn-small add-to-cart-btn" data-id="${ebook.id}">
                        <i class="fas fa-cart-plus"></i> Comprar
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Adiciona event listeners aos produtos
function addProductEventListeners() {
    // Botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });

    // Botões de preview
    document.querySelectorAll('.preview-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            showProductPreview(productId);
        });
    });

    // Cards clicáveis
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
                const productId = parseInt(this.querySelector('.add-to-cart-btn').dataset.id);
                showProductDetail(productId);
            }
        });
    });
}

// Mostra preview do produto
function showProductPreview(productId) {
    const ebook = ebooks.find(e => e.id === productId);
    if (!ebook) return;

    const modal = createModal(`
        <div class="preview-modal">
            <h2>${ebook.name}</h2>
            <div class="preview-content">
                <div class="preview-image">
                    <img src="${ebook.image}" alt="${ebook.name}" style="max-width: 200px; border-radius: 10px;" 
                         onerror="this.parentNode.innerHTML='<div style=\\'font-size: 8rem; margin: 20px;\\'>${ebook.fallbackEmoji}</div>'">
                </div>
                <div class="preview-info">
                    <p><strong>Descrição:</strong> ${ebook.description}</p>
                    <p><strong>Faixa etária:</strong> ${ebook.ageRange}</p>
                    <p><strong>Formatos:</strong> ${ebook.downloadFormats.join(', ')}</p>
                    <h4>Características:</h4>
                    <ul>
                        ${ebook.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <div class="preview-price">
                        <span class="price">${formatPrice(ebook.price)}</span>
                        <button class="btn btn-primary" onclick="addToCart(${ebook.id}); closeModal()">
                            <i class="fas fa-cart-plus"></i> Comprar Agora
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// Mostra detalhes completos do produto
function showProductDetail(productId) {
    // Redireciona para página de produto individual (será implementada na Fase 2)
    showNotification('Página de detalhes em desenvolvimento!', 'info');
}

// Cria modal
function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">
                <i class="fas fa-times"></i>
            </button>
            ${content}
        </div>
    `;
    
    // Estilos do modal
    Object.assign(modal.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '1000'
    });
    
    const modalContent = modal.querySelector('.modal-content');
    Object.assign(modalContent.style, {
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative'
    });
    
    const closeBtn = modal.querySelector('.modal-close');
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: '#999'
    });
    
    return modal;
}

// Fecha modal
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}

// Filtro de produtos
function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
    const priceFilter = document.getElementById('priceFilter')?.value || 'all';
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    const filteredEbooks = ebooks.filter(ebook => {
        const matchesCategory = categoryFilter === 'all' || ebook.category === categoryFilter;
        const matchesPrice = priceFilter === 'all' || 
            (priceFilter === 'low' && ebook.price <= 20) ||
            (priceFilter === 'high' && ebook.price > 20);
        const matchesSearch = ebook.name.toLowerCase().includes(searchTerm) ||
            ebook.description.toLowerCase().includes(searchTerm);
        
        return matchesCategory && matchesPrice && matchesSearch;
    });
    
    const container = document.getElementById('products-grid');
    if (container) {
        container.innerHTML = filteredEbooks.map(ebook => createProductCard(ebook)).join('');
        addProductEventListeners();
    }
}

// Função para formatar preço
function formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

// Função para mostrar notificação
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '1001',
        backgroundColor: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Inicialização quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Carrega produtos conforme a página
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }
    
    if (document.getElementById('products-grid')) {
        loadAllProducts();
    }
    
    // Event listeners para filtros
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
    if (priceFilter) priceFilter.addEventListener('change', filterProducts);
    if (searchInput) searchInput.addEventListener('input', filterProducts);
});