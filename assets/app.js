
function getProdutos() {
  let produtos = JSON.parse(localStorage.getItem('produtos'));
  if (!produtos) {
    // Se não houver produtos, inicializa vazio
    produtos = [];
    localStorage.setItem('produtos', JSON.stringify(produtos));
  }
  return produtos;
}

function renderProdutos(lista, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  if (!lista.length) {
    container.innerHTML = '<p style="color:#888">Nenhum produto disponível.</p>';
    return;
  }
  lista.forEach((produto, idx) => {
    container.innerHTML += `
      <div class="produto" onclick="mostrarDetalhesProduto(${produto.id ?? idx})" style="cursor:pointer;">
        <img src="${produto.imagem}" alt="${produto.nome}">
        <div class="produto-info">
          <div class="produto-nome">${produto.nome}</div>
          <div class="produto-preco">${produto.preco}</div>
          <div class="produto-desc">${produto.desc}</div>
          <div class="produto-botoes" onclick="event.stopPropagation();">
            <a href="https://instagram.com/outfitlab.pt" target="_blank">Instagram</a>
          </div>
        </div>
      </div>
    `;
  });
}

function mostrarDetalhesProduto(id) {
  const produtos = getProdutos();
  const produto = produtos.find((p, idx) => (p.id ?? idx) === id);
  if (!produto) return;
  const el = document.getElementById('modal-produto-conteudo');
  el.innerHTML = `
    <img src="${produto.imagem}" alt="${produto.nome}">
    <div class="produto-nome">${produto.nome}</div>
    <div class="produto-preco">${produto.preco}</div>
    <div class="produto-desc">${produto.desc}</div>
    <div class="produto-categorias">Categorias: ${(produto.categoria||[]).join(', ')}</div>
    <div class="produto-stock">Stock: ${produto.stock ?? 'N/A'}</div>
    <div class="produto-botoes">
      <a href="https://instagram.com/outfitlab.pt" target="_blank">Instagram</a>
    </div>
  `;
  document.getElementById('modal-produto').style.display = 'flex';
}

function fecharModalProduto() {
  document.getElementById('modal-produto').style.display = 'none';
}

function renderPrecosTabela() {
  // Preçário atualizado com base nos custos do fornecedor + 5€ envio
  const html = `
    <div class="preco-card">
      <div class="preco-sec">
        <div class="preco-sec-titulo">Camisolas</div>
        <div class="preco-linha"><span>Camisa de Fã</span><span>18€</span></div>
        <div class="preco-linha"><span>Mangas compridas</span><span>20€</span></div>
        <div class="preco-linha"><span>Vintage</span><span>23€</span></div>
        <div class="preco-linha"><span>Mangas compridas retrô</span><span>24€</span></div>
        <div class="preco-linha"><span>Versão do jogador</span><span>24€</span></div>
        <div class="preco-linha"><span>Terno adulto</span><span>20€</span></div>
      </div>
      <hr>
      <div class="preco-sec">
        <div class="preco-sec-titulo">Personalizações</div>
        <div class="preco-linha"><span>Personalização (nome e número)</span><span>5€</span></div>
        <div class="preco-linha"><span>Patch</span><span>1€</span></div>
      </div>
      <hr>
      <div class="preco-sec">
        <div class="preco-sec-titulo">Outros</div>
        <div class="preco-linha"><span>Conjunto infantil</span><span>18€</span></div>
        <div class="preco-linha"><span>Shorts</span><span>15€</span></div>
        <div class="preco-linha"><span>Casaco</span><span>38€</span></div>
        <div class="preco-linha"><span>Camisa treino manga curta</span><span>25€</span></div>
        <div class="preco-linha"><span>Fato treino</span><span>30–35€</span></div>
        <div class="preco-linha"><span>NBA</span><span>22€</span></div>
      </div>
      <div style="margin-top:1.2rem;font-size:0.98rem;color:#fff200;text-align:center;">* Todos os preços já incluem custos de envio</div>
    </div>
  `;
  document.getElementById('precos-tabela').innerHTML = html;
}

function filtrarCategoria(cat) {
  const produtos = getProdutos();
  let filtrados;
  if (cat === 'todas') filtrados = produtos;
  else if (cat === 'novidades') filtrados = produtos.filter(p => (p.categoria||[]).includes('novidades'));
  else if (cat === 'promocoes') filtrados = produtos.filter(p => p.promocao);
  else filtrados = produtos.filter(p => (p.categoria||[]).includes(cat));
  renderProdutos(filtrados, 'catalogo-list');
}

function atualizarCatalogo() {
  const produtos = getProdutos();
  renderProdutos(produtos.filter(p => (p.categoria||[]).includes('novidades')), 'novidades-list');
  renderProdutos(produtos.filter(p => p.promocao), 'promocoes-list');
  renderProdutos(produtos, 'catalogo-list');
}

// --- Limpar localStorage se o site for movido de pasta ---
document.addEventListener('DOMContentLoaded', () => {
  try {
    const storageKey = 'outfitlab_site_path';
    const currentPath = window.location.pathname;
    const savedPath = localStorage.getItem(storageKey);
    if (savedPath && savedPath !== currentPath) {
      // Site foi movido, limpar localStorage (produtos, imagem, etc.)
      localStorage.removeItem('produtos');
      localStorage.removeItem('imagemAbertura');
      // Podes adicionar mais chaves se necessário
      alert('O site foi movido de pasta. Os dados antigos foram limpos para evitar erros.');
    }
    localStorage.setItem(storageKey, currentPath);
  } catch (e) {}
  // Atualizar imagem de abertura se existir personalizada
  const hero = document.querySelector('.hero');
  const imgAbertura = localStorage.getItem('imagemAbertura');
  if (hero && imgAbertura) {
    hero.style.backgroundImage = `url('${imgAbertura}')`;
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center';
  }
  atualizarCatalogo();
  renderPrecosTabela();
});
window.addEventListener('storage', () => {
  // Atualizar imagem de abertura se alterada noutra aba
  const hero = document.querySelector('.hero');
  const imgAbertura = localStorage.getItem('imagemAbertura');
  if (hero && imgAbertura) {
    hero.style.backgroundImage = `url('${imgAbertura}')`;
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center';
  }
  atualizarCatalogo();
  renderPrecosTabela();
});
