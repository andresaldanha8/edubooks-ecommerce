// ===================================
// EDUBOOKS KIDS - IMAGENS TEMPORÁRIAS
// ===================================

// Sistema de imagens temporárias para demonstração
function updateProductsWithTempImages() {
    console.log('Carregando imagens temporárias para demonstração...');
    
    // Atualiza cards de produtos com gradientes coloridos
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        const imageEl = card.querySelector('.product-image');
        if (imageEl) {
            const gradients = [
                'linear-gradient(135deg, #ff6b35, #f7931e)',
                'linear-gradient(135deg, #667eea, #764ba2)',
                'linear-gradient(135deg, #f093fb, #f5576c)',
                'linear-gradient(135deg, #4facfe, #00f2fe)',
                'linear-gradient(135deg, #43e97b, #38f9d7)',
                'linear-gradient(135deg, #ffecd2, #fcb69f)',
                'linear-gradient(135deg, #a8edea, #fed6e3)',
                'linear-gradient(135deg, #fad0c4, #ffd1ff)'
            ];
            
            imageEl.style.background = gradients[index % gradients.length];
        }
    });
    
    // Atualiza hero com animação
    const heroImage = document.querySelector('.hero-illustration');
    if (heroImage) {
        // Adiciona mais elementos visuais
        const existingContent = heroImage.innerHTML;
        heroImage.innerHTML = existingContent + `
            <div style="margin-top: 20px; font-size: 1rem; opacity: 0.8;">
                ✨ Mais de 500 ebooks disponíveis ✨
            </div>
        `;
    }
}

// Cria placeholder de imagem com emoji e gradiente
function createImagePlaceholder(emoji, gradient = 'linear-gradient(135deg, #ff6b35, #f7931e)') {
    return `
        <div style="
            width: 100%;
            height: 200px;
            background: ${gradient};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            color: white;
            border-radius: 10px;
            position: relative;
            overflow: hidden;
        ">
            <span style="z-index: 2;">${emoji}</span>
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
            "></div>
        </div>
    `;
}

// Simula carregamento de imagens
function simulateImageLoading() {
    const images = document.querySelectorAll('.product-image, .hero-image img');
    
    images.forEach((img, index) => {
        // Adiciona efeito de loading
        img.style.transition = 'all 0.3s ease';
        img.style.opacity = '0.7';
        
        setTimeout(() => {
            img.style.opacity = '1';
            img.style.transform = 'scale(1.02)';
            
            setTimeout(() => {
                img.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
}

// Adiciona efeitos visuais aos emojis
function enhanceEmojiDisplay() {
    const emojiElements = document.querySelectorAll('.product-image, .book, .kids-emoji span');
    
    emojiElements.forEach(element => {
        element.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
        element.style.filter = 'drop-shadow(0 0 10px rgba(255,107,53,0.3))';
    });
}

// Inicializa sistema de imagens temporárias
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        updateProductsWithTempImages();
        simulateImageLoading();
        enhanceEmojiDisplay();
    }, 500);
});

// Exporta funções
window.TempImagesModule = {
    updateProductsWithTempImages,
    createImagePlaceholder,
    simulateImageLoading,
    enhanceEmojiDisplay
};