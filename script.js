// Contagem regressiva para o casamento
const weddingDate = new Date("August 16, 2025 16:00:00").getTime();

const countdown = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;
    
    if (distance < 0) {
        clearInterval(countdown);
        document.querySelector(".countdown").innerHTML = "<h3>Estamos casados!</h3>";
    }
}, 1000);

// Formulário de confirmação
document.getElementById("rsvp-form").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Obrigado por confirmar sua presença! Entraremos em contato em breve com mais detalhes.");
    this.reset();
    return false;
});

// Menu fixo ao rolar
window.addEventListener("scroll", function() {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 100) {
        navbar.style.top = "0";
    } else {
        navbar.style.top = "-70px";
    }
});

// Função para carregar e exibir comentários
function loadComments() {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';
    
    // Recupera comentários do localStorage
    const comments = JSON.parse(localStorage.getItem('pixComments')) || [];
    
    // Ordena por data (mais recente primeiro)
    comments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Adiciona cada comentário à lista
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
            <div class="comment-header">
                <strong>${comment.name}</strong>
                <span>${new Date(comment.date).toLocaleDateString('pt-BR')}</span>
            </div>
            ${comment.amount ? `<div class="comment-amount">Contribuição: R$${parseFloat(comment.amount).toFixed(2)}</div>` : ''}
            <div class="comment-message">${comment.message}</div>
        `;
        commentsList.appendChild(commentElement);
    });
}

// Manipula o envio do formulário de comentários
document.getElementById('comment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('comment-name').value;
    const message = document.getElementById('comment-message').value;
    const amount = document.getElementById('comment-amount').value;
    
    // Cria objeto de comentário
    const comment = {
        name,
        message,
        amount: amount ? amount : null,
        date: new Date().toISOString()
    };
    
    // Salva no localStorage
    const comments = JSON.parse(localStorage.getItem('pixComments')) || [];
    comments.push(comment);
    localStorage.setItem('pixComments', JSON.stringify(comments));
    
    // Recarrega a lista de comentários
    loadComments();
    
    // Reseta o formulário
    this.reset();
    alert('Mensagem enviada com sucesso! Obrigado pela contribuição.');
    return false;
});

// Carrega comentários quando a página é carregada
document.addEventListener('DOMContentLoaded', loadComments);

// Previne recarregamento da página nos formulários
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        return false;
    });
});