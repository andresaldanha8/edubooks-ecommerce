// ===================================
// EDUBOOKS KIDS - CONTATO
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Validações
    if (!name || !email || !subject || !message) {
        showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Email inválido!', 'error');
        return;
    }
    
    if (message.length < 10) {
        showNotification('A mensagem deve ter pelo menos 10 caracteres!', 'error');
        return;
    }
    
    // Simula envio
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Simula sucesso no envio
        showNotification('Mensagem enviada com sucesso! Responderemos em breve.', 'success');
        
        // Reseta o formulário
        e.target.reset();
        
        // Restaura o botão
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Salva a mensagem localmente para referência
        saveContactMessage({
            name,
            email,
            phone,
            subject,
            message,
            sentAt: new Date().toISOString()
        });
        
    }, 2000);
}

function saveContactMessage(messageData) {
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push(messageData);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
}

// Exporta funções
window.ContactModule = {
    saveContactMessage
};