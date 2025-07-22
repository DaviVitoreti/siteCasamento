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

const API_URL = "https://script.google.com/macros/s/AKfycbywRNOHoS4jYpB36Xhj86GcHTtcqX-BdYjMsyZZK4DArBQhmFX6IrNuUV3rnUaUasNo5g/exec";

// Função para carregar comentários
async function loadComments() {
  const commentsList = document.getElementById('comments-list');
  commentsList.innerHTML = '<div class="loading">Carregando...</div>';
  
  try {
    const response = await fetch(API_URL);
    const comments = await response.json();
    
    commentsList.innerHTML = '';
    
    if (comments.length === 0) {
      commentsList.innerHTML = '<p>Nenhum comentário ainda. Seja o primeiro!</p>';
      return;
    }
    
    // Ordena por data (mais recente primeiro)
    comments.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    // Adiciona cada comentário à lista
    comments.forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.classList.add('comment');
      commentElement.innerHTML = `
        <div class="comment-header">
          <strong>${comment.nome}</strong>
          <span>${new Date(comment.data).toLocaleDateString('pt-BR')}</span>
        </div>
        ${comment.valor ? `<div class="comment-amount">Contribuição: R$${parseFloat(comment.valor).toFixed(2)}</div>` : ''}
        <div class="comment-message">${comment.mensagem}</div>
      `;
      commentsList.appendChild(commentElement);
    });
  } catch (error) {
    commentsList.innerHTML = '<p class="error">Erro ao carregar comentários. Atualize a página.</p>';
    console.error('Erro ao carregar comentários:', error);
  }
}

// Manipula o envio do formulário de comentários
document.getElementById('comment-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const name = document.getElementById('comment-name').value.trim();
  const message = document.getElementById('comment-message').value.trim();
  const amount = document.getElementById('comment-amount').value.trim();
  
  if (!name || !message) {
    alert('Por favor, preencha pelo menos o nome e a mensagem.');
    return;
  }
  
  const btn = this.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Enviando...';
  
  try {
    // Corrigido: usando nomes em português que o Google Apps Script espera
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        nome: name, 
        mensagem: message, 
        valor: amount || null 
      })
    });
    
    if (response.ok) {
      await loadComments();
      this.reset();
      alert('Mensagem enviada com sucesso! Obrigado pela contribuição.');
    } else {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error('Erro ao enviar comentário:', error);
    alert('Erro ao enviar mensagem. Por favor, tente novamente mais tarde.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Enviar Mensagem';
  }
});

// Carrega comentários quando a página é carregada
document.addEventListener('DOMContentLoaded', loadComments);