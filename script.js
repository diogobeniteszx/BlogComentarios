// Artigos de exemplo; os comentários enviados ficam salvos no navegador.
const articles = [
  { id: 1, category: "Criatividade", date: "12 jun 2025", title: "O valor de fazer uma coisa de cada vez", excerpt: "Entre notificações e listas intermináveis, concentrar a atenção virou um pequeno ato de cuidado. E pode mudar a forma como criamos.", author: "Marina Costa", readTime: "4 min de leitura", cover: "#e6dfcc", shape: "#b9aa86", symbol: "◒" },
  { id: 2, category: "Tecnologia", date: "08 jun 2025", title: "Tecnologia boa é aquela que cabe na vida", excerpt: "Nem toda novidade precisa ocupar espaço no nosso dia. Conversamos sobre ferramentas que ajudam sem tomar o protagonismo.", author: "Rafael Lima", readTime: "6 min de leitura", cover: "#dce4dc", shape: "#a4b6a5", symbol: "⌘" },
  { id: 3, category: "Cotidiano", date: "02 jun 2025", title: "Pequenos rituais para dias mais leves", excerpt: "Um café sem pressa, uma caminhada curta, algumas páginas. Às vezes, a rotina melhora quando a gente repara no que já existe.", author: "Lia Martins", readTime: "3 min de leitura", cover: "#eadbd0", shape: "#c99d82", symbol: "☼" },
  { id: 4, category: "Criatividade", date: "28 mai 2025", title: "Começar mal também é começar", excerpt: "A primeira versão raramente é a melhor. Tirar uma ideia da cabeça e colocá-la no papel já é metade do caminho.", author: "Marina Costa", readTime: "5 min de leitura", cover: "#e2dfeb", shape: "#b1a7c6", symbol: "✳" },
  { id: 5, category: "Tecnologia", date: "21 mai 2025", title: "O que a internet faz quando a gente escuta", excerpt: "Por trás de cada tela, há pessoas. Uma conversa respeitosa pode transformar um espaço digital em lugar de encontro.", author: "João Ribeiro", readTime: "4 min de leitura", cover: "#d8e3e5", shape: "#9db8bc", symbol: "◎" },
  { id: 6, category: "Cotidiano", date: "15 mai 2025", title: "Uma biblioteca, uma praça e um domingo", excerpt: "Às vezes, descobrir um lugar novo na própria cidade é tudo o que a semana precisa para ganhar outro ritmo.", author: "Diogo Alves", readTime: "3 min de leitura", cover: "#e9e1d2", shape: "#c3ad83", symbol: "⌂" }
];

const articlesPerPage = 3;
let currentPage = 1;
let openArticleId = null;
const sessionComments = new Map();
const articleList = document.querySelector("#article-list");
const pagination = document.querySelector("#pagination");
const pageStatus = document.querySelector("#page-status");

function getComments(articleId) {
  try {
    const saved = JSON.parse(localStorage.getItem(`entre-linhas-comentarios-${articleId}`));
    return Array.isArray(saved) ? saved : (sessionComments.get(articleId) || []);
  } catch {
    return sessionComments.get(articleId) || [];
  }
}

function renderArticles() {
  const start = (currentPage - 1) * articlesPerPage;
  const visibleArticles = articles.slice(start, start + articlesPerPage);
  articleList.innerHTML = visibleArticles.map((article) => {
    const comments = getComments(article.id);
    const isOpen = openArticleId === article.id;
    return `
      <div class="col-md-6 col-lg-4">
        <article class="article-card" aria-labelledby="article-title-${article.id}">
          <div class="article-cover" style="--cover:${article.cover};--shape:${article.shape}" aria-hidden="true">
            <span class="cover-number">0${article.id}</span><span class="cover-symbol">${article.symbol}</span>
          </div>
          <div class="article-body">
            <div class="article-meta"><span class="category">${article.category}</span><span class="dot">•</span><time>${article.date}</time></div>
            <h3 class="article-title" id="article-title-${article.id}">${article.title}</h3>
            <p class="article-excerpt">${article.excerpt}</p>
            <div class="article-byline">Por ${article.author} <span class="dot">·</span> ${article.readTime}</div>
          </div>
          <button class="comment-toggle" type="button" data-toggle-comments="${article.id}" aria-expanded="${isOpen}" aria-controls="comments-${article.id}">
            <span>Comentários <span class="comment-count">(${comments.length})</span></span><span aria-hidden="true">${isOpen ? "−" : "+"}</span>
          </button>
          ${isOpen ? renderCommentPanel(article, comments) : ""}
        </article>
      </div>`;
  }).join("");
  pageStatus.textContent = `Mostrando ${start + 1}–${start + visibleArticles.length} de ${articles.length} artigos`;
  renderPagination();
}

function renderCommentPanel(article, comments) {
  const commentMarkup = comments.length
    ? comments.map((comment) => `<li class="comment-item"><span class="comment-name">${escapeHtml(comment.name)}</span><p class="comment-message">${escapeHtml(comment.message)}</p></li>`).join("")
    : '<li class="empty-comments">Ainda não há comentários. Comece a conversa!</li>';
  return `<section class="comment-panel" id="comments-${article.id}" aria-label="Comentários do artigo ${article.title}">
    <ul class="comment-list">${commentMarkup}</ul>
    <form class="comment-form" data-comment-form="${article.id}">
      <label for="name-${article.id}">Seu nome</label>
      <input class="form-control" id="name-${article.id}" name="name" type="text" maxlength="40" placeholder="Como podemos chamar você?" required>
      <label for="message-${article.id}">Seu comentário</label>
      <textarea class="form-control" id="message-${article.id}" name="message" maxlength="500" placeholder="Escreva sua opinião..." required></textarea>
      <button class="btn btn-dark rounded-pill" type="submit">Publicar comentário</button>
    </form>
  </section>`;
}

function renderPagination() {
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const pageButton = (label, page, disabled = false, active = false, ariaLabel = label) =>
    `<li class="page-item${disabled ? " disabled" : ""}${active ? " active" : ""}"><button class="page-link" type="button" data-page="${page}" aria-label="${ariaLabel}" ${disabled ? "disabled" : ""} ${active ? 'aria-current="page"' : ""}>${label}</button></li>`;
  pagination.innerHTML = pageButton("‹", currentPage - 1, currentPage === 1, false, "Página anterior") +
    Array.from({ length: totalPages }, (_, index) => pageButton(index + 1, index + 1, false, currentPage === index + 1, `Página ${index + 1}`)).join("") +
    pageButton("›", currentPage + 1, currentPage === totalPages, false, "Próxima página");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
}

articleList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-toggle-comments]");
  if (!button) return;
  const articleId = Number(button.dataset.toggleComments);
  openArticleId = openArticleId === articleId ? null : articleId;
  renderArticles();
  if (openArticleId === articleId) document.querySelector(`#name-${articleId}`).focus();
});

articleList.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-comment-form]");
  if (!form) return;
  event.preventDefault();
  const articleId = Number(form.dataset.commentForm);
  const formData = new FormData(form);
  const name = formData.get("name").trim();
  const message = formData.get("message").trim();
  if (!name || !message) return;
  const comments = getComments(articleId);
  comments.push({ name, message });
  sessionComments.set(articleId, comments);
  try {
    localStorage.setItem(`entre-linhas-comentarios-${articleId}`, JSON.stringify(comments));
  } catch {
    // O comentário permanece disponível durante a sessão se o armazenamento for bloqueado.
  }
  openArticleId = articleId;
  renderArticles();
  document.querySelector(`#name-${articleId}`).focus();
});

pagination.addEventListener("click", (event) => {
  const button = event.target.closest("[data-page]");
  if (!button || button.disabled) return;
  currentPage = Number(button.dataset.page);
  openArticleId = null;
  renderArticles();
  document.querySelector("#artigos").scrollIntoView({ behavior: "smooth" });
});

renderArticles();
