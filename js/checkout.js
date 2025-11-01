// CHECKOUT SYSTEM FOR EDUBOOKS KIDS
class CheckoutManager {
    constructor() {
        this.currentProduct = null;
        this.cartItems = [];
        this.loadCheckoutData();
        this.initializeEventListeners();
    }

    loadCheckoutData() {
        // Novo fluxo: lê dados do localStorage 'checkout' (apenas 1 livro)
        const checkoutData = JSON.parse(localStorage.getItem('checkout') || '{}');
        if (checkoutData && checkoutData.items && checkoutData.items.length > 0) {
            // Busca o produto pelo id em ebooks ou products
            const item = checkoutData.items[0];
            let product = null;
            if (window.ebooks) {
                product = window.ebooks.find(e => e.id === item.id);
            }
            if (!product && window.products) {
                product = window.products.find(p => p.id === item.id);
            }
            if (product) {
                this.currentProduct = product;
                this.currentProduct.quantity = item.quantity;
                this.displaySingleCheckout(product, item.quantity, checkoutData.total);
            } else {
                this.displayError('Produto não encontrado para checkout.');
            }
        } else {
            this.displayError('Nenhum item encontrado para checkout.');
        }
    }

    displaySingleCheckout(product, quantity, total) {
        // Suporte a diferentes nomes de propriedades
        const name = product.name || product.title || 'Produto';
        const image = product.image || '';
        // Atualiza o resumo do pedido na tela
        const summary = document.getElementById('checkout-summary');
        if (summary) {
            summary.innerHTML = `
                <div class="checkout-product">
                    <img src="${image}" alt="${name}">
                    <div class="checkout-product-info">
                        <h4>${name}</h4>
                        <div class="checkout-price">
                            <span class="quantity">Quantidade: ${quantity}</span>
                            <span class="price">R$ ${(product.price * quantity).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        // Atualiza subtotal e total
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        if (subtotalEl) subtotalEl.textContent = `R$ ${(product.price * quantity).toFixed(2)}`;
        if (totalEl) totalEl.textContent = `R$ ${(product.price * quantity).toFixed(2)}`;
    }

    displayError(msg) {
        const summary = document.getElementById('checkout-summary');
        if (summary) {
            summary.innerHTML = `<div style='color: red; padding: 20px;'>${msg}</div>`;
        }
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        if (subtotalEl) subtotalEl.textContent = 'R$ 0,00';
        if (totalEl) totalEl.textContent = 'R$ 0,00';
    }

    displayDirectPurchase(product) {
        const productSummary = document.querySelector('.product-summary');
        
        productSummary.innerHTML = `
            <h3>Resumo do Pedido</h3>
            <div class="checkout-product">
                <img src="${product.image}" alt="${product.title}">
                <div class="checkout-product-info">
                    <h4>${product.title}</h4>
                    <p>${product.description}</p>
                    <div class="checkout-price">
                        <span class="quantity">Quantidade: 1</span>
                        <span class="price">R$ ${product.price.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <div class="total-section">
                <div class="total-line">
                    <span>Subtotal:</span>
                    <span>R$ ${product.price.toFixed(2)}</span>
                </div>
                <div class="total-line">
                    <span>Taxa de processamento:</span>
                    <span>Grátis</span>
                </div>
                <div class="total-line total-final">
                    <span>Total:</span>
                    <span>R$ ${product.price.toFixed(2)}</span>
                </div>
            </div>

            <div class="product-benefits">
                <h4>O que você vai receber:</h4>
                <ul>
                    <li>✅ Ebook em PDF de alta qualidade</li>
                    <li>✅ Entrega imediata no seu email</li>
                    <li>✅ Acesso vitalício</li>
                    <li>✅ Garantia de 7 dias</li>
                    <li>✅ Suporte via WhatsApp</li>
                </ul>
            </div>
        `;
    }

    displayCartItems() {
        const productSummary = document.querySelector('.product-summary');
        let subtotal = 0;
        let itemsHtml = '';

        this.cartItems.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const itemTotal = product.price * item.quantity;
                subtotal += itemTotal;

                itemsHtml += `
                    <div class="checkout-product">
                        <img src="${product.image}" alt="${product.title}">
                        <div class="checkout-product-info">
                            <h4>${product.title}</h4>
                            <p>${product.description}</p>
                            <div class="checkout-price">
                                <span class="quantity">Quantidade: ${item.quantity}</span>
                                <span class="price">R$ ${itemTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        productSummary.innerHTML = `
            <h3>Resumo do Pedido</h3>
            ${itemsHtml}
            
            <div class="total-section">
                <div class="total-line">
                    <span>Subtotal:</span>
                    <span>R$ ${subtotal.toFixed(2)}</span>
                </div>
                <div class="total-line">
                    <span>Taxa de processamento:</span>
                    <span>Grátis</span>
                </div>
                <div class="total-line total-final">
                    <span>Total:</span>
                    <span>R$ ${subtotal.toFixed(2)}</span>
                </div>
            </div>
        `;
    }

    initializeEventListeners() {
        // Intercepta o submit do formulário para impedir reload
        const form = document.getElementById('checkout-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processPurchase();
            });
        }

        // Seleção de método de pagamento
        const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', () => this.handlePaymentMethodChange(method.value));
        });

        // Formulário de email
        const emailInput = document.getElementById('customer-email');
        emailInput?.addEventListener('blur', () => this.validateEmail(emailInput.value));
    }

    handlePaymentMethodChange(method) {
        const cardSection = document.getElementById('card-details');
        
        if (method === 'card' && cardSection) {
            cardSection.style.display = 'block';
        } else if (cardSection) {
            cardSection.style.display = 'none';
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailInput = document.getElementById('customer-email');
        
        if (!emailRegex.test(email)) {
            emailInput.style.borderColor = '#dc3545';
            return false;
        } else {
            emailInput.style.borderColor = '#28a745';
            return true;
        }
    }

    processPurchase() {
        const email = document.getElementById('customer-email').value;
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;

        // Validações
        if (!this.validateEmail(email)) {
            alert('Por favor, insira um email válido.');
            return;
        }

        if (!paymentMethod) {
            alert('Por favor, selecione um método de pagamento.');
            return;
        }

        // Processar pagamento baseado no método
        if (paymentMethod === 'pix') {
            this.processPixPayment(email);
        } else if (paymentMethod === 'card') {
            this.processCreditCardPayment(email);
        }
    }

    async processPixPayment(email) {
        const total = this.calculateTotal();
        try {
            const response = await fetch('/.netlify/functions/create-preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: this.currentProduct ? (this.currentProduct.title || this.currentProduct.name) : 'Ebook',
                    quantity: this.currentProduct ? this.currentProduct.quantity || 1 : 1,
                    price: total,
                    email: email
                })
            });
            let data = null;
            let erroDetalhado = '';
            try {
                data = await response.json();
            } catch (jsonErr) {
                erroDetalhado = `Status: ${response.status} ${response.statusText}`;
            }
            if (!response.ok) {
                alert('Erro ao gerar pagamento PIX: ' + (data && data.error ? data.error : erroDetalhado));
                return;
            }
            if (data && data.qr_code_base64 && data.qr_code) {
                this.showPixModal(data.qr_code, total, email, data.qr_code_base64);
            } else if (data && (data.init_point || data.sandbox_init_point)) {
                this.showMercadoPagoLinkModal(data.init_point || data.sandbox_init_point);
            } else {
                alert('Erro ao gerar pagamento PIX: QR Code não recebido.\n' + JSON.stringify(data));
            }
        } catch (err) {
            alert('Erro ao gerar pagamento PIX: ' + err.message);
        }
    }
    showMercadoPagoLinkModal(link) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.7)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        modal.innerHTML = `
            <div class="modal-content" style="background: white; border-radius: 15px; padding: 30px; max-width: 400px; width: 100%; box-shadow: 0 8px 40px rgba(0,0,0,0.2); text-align: center;">
                <h3>Pagamento via Mercado Pago</h3>
                <p>Seu banco ou conta Mercado Pago não está habilitado para PIX instantâneo.<br>Você pode finalizar a compra pelo site do Mercado Pago:</p>
                <a href="${link}" target="_blank" style="display:inline-block;margin:20px 0;padding:15px 30px;background:#009ee3;color:#fff;border-radius:8px;font-size:1.1rem;text-decoration:none;font-weight:bold;">Pagar com Mercado Pago</a>
                <div class="modal-actions" style="margin-top: 20px;">
                    <button class="btn btn-secondary" onclick="checkoutManager.closeModal()">Cancelar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.pixModal = modal;
    }

    processCreditCardPayment(email) {
        // Simular processamento do cartão
        this.showProcessingModal();
        
        setTimeout(() => {
            this.hideProcessingModal();
            this.processPaymentSuccess(email);
        }, 3000);
    }

    generatePixCode() {
        // Simula geração de código PIX
        const randomCode = Math.random().toString(36).substring(2, 15);
        return `00020126580014BR.GOV.BCB.PIX013614${randomCode}520400005303986540${this.calculateTotal().toFixed(2)}5802BR5925EDUBOOKS KIDS EBOOKS6009SAO PAULO`;
    }

    showPixModal(pixCode, total, email, qrCodeBase64) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.7)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        modal.innerHTML = `
            <div class="modal-content" style="background: white; border-radius: 15px; padding: 30px; max-width: 400px; width: 100%; box-shadow: 0 8px 40px rgba(0,0,0,0.2);">
                <div class="pix-payment">
                    <h3>Pagamento via PIX</h3>
                    <p>Escaneie o QR Code ou copie o código PIX:</p>
                    <div class="qr-code">
                        ${qrCodeBase64 ? `<img src="data:image/png;base64,${qrCodeBase64}" alt="QR Code PIX" style="width:200px;height:200px;display:block;margin:0 auto;border-radius:10px;" />` : `<div style=\"width: 200px; height: 200px; background: #f0f0f0; margin: 0 auto; display: flex; align-items: center; justify-content: center; border-radius: 10px;\"><i class=\"fas fa-qrcode\" style=\"font-size: 3rem; color: #666;\"></i></div>`}
                        <p><small>QR Code do PIX</small></p>
                    </div>
                    <div class="pix-value">
                        <strong>Valor: R$ ${total.toFixed(2)}</strong>
                    </div>
                    <div class="code-box">
                        <code id="pix-code">${pixCode}</code>
                        <button class="btn-copy" onclick="checkoutManager.copyPixCode()">
                            <i class="fas fa-copy"></i> Copiar
                        </button>
                    </div>
                    <div class="pix-timer" id="pix-timer">
                        ⏰ Tempo restante: <span id="timer-display">15:00</span>
                    </div>
                    <p><strong>Instruções:</strong></p>
                    <ol style="text-align: left;">
                        <li>Abra o app do seu banco</li>
                        <li>Escolha a opção PIX</li>
                        <li>Escaneie o QR Code ou cole o código</li>
                        <li>Confirme o pagamento</li>
                    </ol>
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="checkoutManager.closeModal()">
                            Cancelar
                        </button>
                        <button class="btn btn-primary" onclick="checkoutManager.simulatePixPayment('${email}')">
                            Simular Pagamento ✅
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.startPixTimer();
        this.pixModal = modal;
    }

    copyPixCode() {
        const pixCode = document.getElementById('pix-code').textContent;
        navigator.clipboard.writeText(pixCode).then(() => {
            alert('Código PIX copiado!');
        });
    }

    startPixTimer() {
        let timeLeft = 15 * 60; // 15 minutos
        const timerDisplay = document.getElementById('timer-display');
        
        const timer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                this.expirePixPayment();
            }
            
            timeLeft--;
        }, 1000);

        this.pixTimer = timer;
    }

    simulatePixPayment(email) {
        clearInterval(this.pixTimer);
        this.closeModal();
        this.processPaymentSuccess(email);
    }

    expirePixPayment() {
        alert('Tempo limite do PIX expirado. Tente novamente.');
        this.closeModal();
    }

    showProcessingModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="text-align: center; padding: 50px;">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #ff6b35;"></i>
                </div>
                <h3>Processando pagamento...</h3>
                <p>Aguarde enquanto processamos seu cartão de crédito.</p>
            </div>
        `;
        document.body.appendChild(modal);
        this.processingModal = modal;
    }

    hideProcessingModal() {
        if (this.processingModal) {
            this.processingModal.remove();
            this.processingModal = null;
        }
    }

    processPaymentSuccess(email) {
        // Limpar carrinho e checkout
        localStorage.removeItem('cart');
        localStorage.removeItem('checkout');
        // Gerar links de download
        const downloadLinks = this.generateDownloadLinks();
        // Mostrar sucesso com downloads
        this.showSuccessModal(email, downloadLinks);
        // Simular envio de email
        this.simulateEmailDelivery(email, downloadLinks);
        // Iniciar downloads automaticamente após 3 segundos
        setTimeout(() => {
            this.startAutomaticDownloads(downloadLinks);
        }, 3000);
    }

    showSuccessModal(email, downloadLinks) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        
        const downloadButtons = downloadLinks.map(item => 
            `<button class="btn-download" onclick="checkoutManager.downloadFile('${item.file}', '${item.name}')" style="background: #28a745; color: white; padding: 15px 20px; margin: 10px; border: none; border-radius: 8px; cursor: pointer; display: block; width: 100%;">
                <i class="fas fa-download"></i> Baixar ${item.name}
            </button>`
        ).join('');
        
        modal.innerHTML = `
            <div class="modal-content" style="text-align: center; padding: 50px; max-width: 600px;">
                <div style="font-size: 4rem; color: #28a745; margin-bottom: 20px;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>🎉 Pagamento Aprovado!</h2>
                <p>Seu pedido foi processado com sucesso!</p>
                
                <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h4>📧 Email de Entrega</h4>
                    <p><strong>${email}</strong></p>
                    <p><small>Seus ebooks também serão enviados para este email como backup.</small></p>
                </div>

                <div style="background: #fff3e0; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h4>📥 Downloads Disponíveis</h4>
                    <p><small>Clique nos botões abaixo para baixar seus ebooks:</small></p>
                    <div class="download-section" style="margin: 15px 0;">
                        ${downloadButtons}
                    </div>
                    <p><small style="color: #666;">💡 Os downloads iniciarão automaticamente em alguns segundos</small></p>
                </div>

                <div style="background: #fff5f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h4>📱 Suporte</h4>
                    <p>Dúvidas ou problemas com o download?</p>
                    <p><strong>WhatsApp: (93) 99135-5643</strong></p>
                    <p><strong>Instagram: @bhconvitesvtx</strong></p>
                </div>

                <div class="modal-actions" style="margin-top: 30px;">
                    <button class="btn btn-primary" onclick="window.location.href='index.html'" style="background: #ff6b35; color: white; padding: 15px 30px; border: none; border-radius: 8px; margin: 10px; cursor: pointer;">
                        <i class="fas fa-home"></i> Voltar ao Início
                    </button>
                    <button class="btn btn-secondary" onclick="window.location.href='produtos.html'" style="background: #6c757d; color: white; padding: 15px 30px; border: none; border-radius: 8px; margin: 10px; cursor: pointer;">
                        <i class="fas fa-book"></i> Ver Mais Ebooks
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    generateDownloadLinks() {
        const downloadLinks = [];
        
        if (this.currentProduct) {
            // Compra direta de um produto
            downloadLinks.push({
                name: this.currentProduct.title,
                file: `ebooks/${this.currentProduct.title.toLowerCase().replace(/\s+/g, '-')}.pdf`
            });
        } else {
            // Compra do carrinho
            this.cartItems.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    for (let i = 0; i < item.quantity; i++) {
                        downloadLinks.push({
                            name: product.title,
                            file: `ebooks/${product.title.toLowerCase().replace(/\s+/g, '-')}.pdf`
                        });
                    }
                }
            });
        }
        
        return downloadLinks;
    }

    downloadFile(filepath, filename) {
        // Cria um link para download do arquivo PDF
        const link = document.createElement('a');
        
        // 🚀 ATIVE ESTA LINHA PARA DOWNLOADS REAIS:
        link.href = filepath;
        
        // 🧪 MODO SIMULAÇÃO (ATUAL):
        // link.href = '#';
        
        link.download = `${filename}.pdf`;
        
        // Download real
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log(`📥 Download real iniciado: ${filename}`);
    }

    startAutomaticDownloads(downloadLinks) {
        downloadLinks.forEach((item, index) => {
            setTimeout(() => {
                this.downloadFile(item.file, item.name);
            }, index * 1000); // Espaça downloads de 1 em 1 segundo
        });
    }

    simulateEmailDelivery(email, downloadLinks) {
        // Simula envio do email com os ebooks
        console.log(`📧 Enviando ebook(s) para: ${email}`);
        console.log('📁 Arquivos inclusos no email:', downloadLinks);
        
        // Em um sistema real, aqui seria feita a integração com:
        // - API de email (SendGrid, Mailgun, etc.)
        // - Sistema de entrega de arquivos
        // - Banco de dados de pedidos
        // - Sistema de geração de links únicos de download
        
        // Simula confirmação de envio
        setTimeout(() => {
            console.log(`✅ Email enviado com sucesso para ${email}`);
        }, 2000);
    }

    calculateTotal() {
        if (this.currentProduct) {
            return this.currentProduct.price;
        } else {
            return this.cartItems.reduce((total, item) => {
                const product = products.find(p => p.id === item.id);
                return total + (product ? product.price * item.quantity : 0);
            }, 0);
        }
    }

    closeModal() {
        if (this.pixModal) {
            clearInterval(this.pixTimer);
            this.pixModal.remove();
            this.pixModal = null;
        }
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.checkoutManager = new CheckoutManager();
});