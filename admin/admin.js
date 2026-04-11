// --- Login simples (hardcoded) ---
const ADMIN_USER = 'Rodri';
const ADMIN_PASS = 'outfitlab2026';

document.getElementById('form-login').addEventListener('submit', function(e) {
  e.preventDefault();
  const user = document.getElementById('login-user').value;
  const pass = document.getElementById('login-pass').value;
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    document.getElementById('login-panel').style.display = 'none';
    document.getElementById('admin-panel').style.display = '';
    renderNovoPainelAdmin();
  } else {
    document.getElementById('login-erro').textContent = 'Credenciais inválidas!';
  }
});

// Função para renderizar o novo painel admin organizado
function renderNovoPainelAdmin() {
  document.getElementById('admin-panel').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <h2>Painel de Administração</h2>
      <button onclick="adminLogout()" style="background:#ff5252;color:#fff;padding:0.5rem 1.2rem;border:none;border-radius:0.7rem;font-weight:700;cursor:pointer;">Sair</button>
    </div>
    <nav id="admin-menu" style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:2rem;">
      <button onclick="adminEscolher('novidades')">Adicionar Novidades</button>
      <button onclick="adminEscolher('precos')">Alterar Preços</button>
      <button onclick="adminEscolher('promocoes')">Fazer Promoções</button>
      <button onclick="adminEscolher('imagem')">Mudar Imagem de Abertura</button>
      <button onclick="adminEscolher('remover')">Remover Produtos</button>
    </nav>
    <div id="admin-content"></div>
  `;
}

window.adminLogout = function() {
  // Forçar sincronização visual (localStorage já está sempre atualizado)
  // Mostrar mensagem de alterações guardadas
  document.getElementById('admin-panel').style.display = 'none';
  document.getElementById('login-panel').style.display = '';
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  document.getElementById('login-erro').textContent = '';
  setTimeout(() => {
    alert('Alterações guardadas!');
  }, 100);
}

window.adminEscolher = function(secao) {
  const content = document.getElementById('admin-content');
  if (secao === 'novidades') {
    content.innerHTML = `
      <h3>Adicionar Novidade</h3>
      <form id="form-novidade" style="display:flex;flex-direction:column;gap:0.7rem;max-width:350px;">
        <label>Nome <input type="text" id="novidade-nome" required></label>
        <label>Preço <input type="text" id="novidade-preco" required></label>
        <label>Descrição <textarea id="novidade-desc" required></textarea></label>
        <label>Imagem (URL) <input type="text" id="novidade-imagem" required></label>
        <label>Categorias <input type="text" id="novidade-categoria" placeholder="Ex: clubes,novidades"></label>
        <label>Promoção <input type="checkbox" id="novidade-promocao"></label>
        <button type="submit">Adicionar Novidade</button>
      </form>
      <div id="novidade-feedback" style="margin-top:1rem;color:#fff200;"></div>
    `;
    document.getElementById('form-novidade').addEventListener('submit', function(e) {
      e.preventDefault();
      const nome = document.getElementById('novidade-nome').value;
      const preco = document.getElementById('novidade-preco').value;
      const desc = document.getElementById('novidade-desc').value;
      const imagem = document.getElementById('novidade-imagem').value;
      const categoria = document.getElementById('novidade-categoria').value.split(',').map(s => s.trim()).filter(Boolean);
      const promocao = document.getElementById('novidade-promocao').checked;
      const novo = { nome, preco, desc, imagem, categoria, promocao };
      let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
      produtos.push(novo);
      localStorage.setItem('produtos', JSON.stringify(produtos));
      document.getElementById('novidade-feedback').textContent = 'Novidade adicionada com sucesso!';
      this.reset();
    });
    return;
  }
  if (secao === 'precos') {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    if (!produtos.length) { content.innerHTML = '<p style="color:#888">Nenhum produto.</p>'; return; }
    let html = '<h3>Alterar Preços</h3>';
    produtos.forEach((p, i) => {
      html += `<div style="margin-bottom:1rem;display:flex;align-items:center;gap:1rem;">
        <img src="${p.imagem}" alt="${p.nome}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;">
        <b>${p.nome}</b>
        <input type="text" value="${p.preco}" style="width:70px;" id="preco-edit-${i}">
        <button onclick="salvarPreco(${i})">Salvar</button>
      </div>`;
    });
    content.innerHTML = html;
    window.salvarPreco = function(i) {
      let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
      const novoPreco = document.getElementById('preco-edit-' + i).value;
      produtos[i].preco = novoPreco;
      localStorage.setItem('produtos', JSON.stringify(produtos));
      adminEscolher('precos');
    }
    return;
  }
  if (secao === 'promocoes') {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    if (!produtos.length) { content.innerHTML = '<p style="color:#888">Nenhum produto.</p>'; return; }
    let html = '<h3>Fazer Promoções</h3>';
    produtos.forEach((p, i) => {
      html += `<div style="margin-bottom:1rem;display:flex;align-items:center;gap:1rem;">
        <img src="${p.imagem}" alt="${p.nome}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;">
        <b>${p.nome}</b>
        <label><input type="checkbox" ${p.promocao ? 'checked' : ''} onchange="togglePromocao(${i})"> Promoção</label>
      </div>`;
    });
    content.innerHTML = html;
    window.togglePromocao = function(i) {
      let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
      produtos[i].promocao = !produtos[i].promocao;
      localStorage.setItem('produtos', JSON.stringify(produtos));
      adminEscolher('promocoes');
    }
    return;
  }
  if (secao === 'imagem') {
    let url = localStorage.getItem('imagemAbertura') || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80';
    content.innerHTML = `
      <h3>Mudar Imagem de Abertura</h3>
      <form id="form-imagem" style="display:flex;flex-direction:column;gap:0.7rem;max-width:350px;">
        <label>URL da nova imagem <input type="text" id="nova-imagem" required></label>
        <button type="submit">Alterar Imagem</button>
      </form>
      <div id="imagem-atual" style="margin-top:1rem;">
        <img src="${url}" alt="Imagem de abertura" style="max-width:100%;border-radius:1rem;">
      </div>
      <div id="imagem-feedback" style="margin-top:1rem;color:#fff200;"></div>
    `;
    document.getElementById('form-imagem').addEventListener('submit', function(e) {
      e.preventDefault();
      const url = document.getElementById('nova-imagem').value;
      localStorage.setItem('imagemAbertura', url);
      adminEscolher('imagem');
      document.getElementById('imagem-feedback').textContent = 'Imagem de abertura alterada!';
    });
    return;
  }
  if (secao === 'remover') {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    if (!produtos.length) { content.innerHTML = '<p style="color:#888">Nenhum produto.</p>'; return; }
    let html = '<h3>Remover Produtos</h3>';
    produtos.forEach((p, i) => {
      html += `<div style="margin-bottom:1rem;display:flex;align-items:center;gap:1rem;">
        <img src="${p.imagem}" alt="${p.nome}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;">
        <b>${p.nome}</b>
        <button onclick="removerProduto(${i})">Remover</button>
      </div>`;
    });
    content.innerHTML = html;
    window.removerProduto = function(i) {
      let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
      produtos.splice(i, 1);
      localStorage.setItem('produtos', JSON.stringify(produtos));
      adminEscolher('remover');
    }
    return;
  }
  content.innerHTML = `<div style='color:#fff'>Em breve: <b>${secao.replace(/^(.)/,c=>c.toUpperCase())}</b></div>`;
}


// NOVA SECÇÃO: Adicionar Novidade
document.getElementById('form-novidade').addEventListener('submit', function(e) {
  e.preventDefault();
  const nome = document.getElementById('novidade-nome').value;
  const preco = document.getElementById('novidade-preco').value;
  const desc = document.getElementById('novidade-desc').value;
  const imagem = document.getElementById('novidade-imagem').value;
  const categoria = document.getElementById('novidade-categoria').value.split(',').map(s => s.trim()).filter(Boolean);
  const promocao = document.getElementById('novidade-promocao').checked;
  const novo = { nome, preco, desc, imagem, categoria, promocao };
  const lista = getProdutos();
  lista.push(novo);
  setProdutos(lista);
  this.reset();
  alert('Novidade adicionada!');
});

// SECÇÃO: Alterar Preços
function renderPrecosAdmin() {
  const lista = getProdutos();
  const container = document.getElementById('admin-precos-lista');
  container.innerHTML = '';
  if (!lista.length) { container.innerHTML = '<p style="color:#888">Nenhum produto.</p>'; return; }
  lista.forEach((p, i) => {
    container.innerHTML += `<div style="margin-bottom:1rem;display:flex;align-items:center;gap:1rem;">
      <img src="${p.imagem}" alt="${p.nome}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;">
      <b>${p.nome}</b>
      <input type="text" value="${p.preco}" style="width:70px;" id="preco-edit-${i}">
      <button onclick="salvarPreco(${i})">Salvar</button>
    </div>`;
  });
}
window.salvarPreco = function(i) {
  const lista = getProdutos();
  const novoPreco = document.getElementById('preco-edit-' + i).value;
  lista[i].preco = novoPreco;
  setProdutos(lista);
  renderPrecosAdmin();
}

// SECÇÃO: Promoções
function renderPromocoesAdmin() {
  const lista = getProdutos();
  const container = document.getElementById('admin-promocoes-lista');
  container.innerHTML = '';
  if (!lista.length) { container.innerHTML = '<p style="color:#888">Nenhum produto.</p>'; return; }
  lista.forEach((p, i) => {
    container.innerHTML += `<div style="margin-bottom:1rem;display:flex;align-items:center;gap:1rem;">
      <img src="${p.imagem}" alt="${p.nome}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;">
      <b>${p.nome}</b>
      <label><input type="checkbox" ${p.promocao ? 'checked' : ''} onchange="togglePromocao(${i})"> Promoção</label>
    </div>`;
  });
}
window.togglePromocao = function(i) {
  const lista = getProdutos();
  lista[i].promocao = !lista[i].promocao;
  setProdutos(lista);
  renderPromocoesAdmin();
}

// SECÇÃO: Mudar Imagem de Abertura
function renderImagemAtual() {
  const url = localStorage.getItem('imagemAbertura') || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80';
  document.getElementById('imagem-atual').innerHTML = `<img src="${url}" alt="Imagem de abertura" style="max-width:100%;border-radius:1rem;">`;
}
document.getElementById('form-imagem').addEventListener('submit', function(e) {
  e.preventDefault();
  const url = document.getElementById('nova-imagem').value;
  localStorage.setItem('imagemAbertura', url);
  renderImagemAtual();
  alert('Imagem de abertura alterada!');
});

// SECÇÃO: Remover Produtos
function renderRemoverAdmin() {
  const lista = getProdutos();
  const container = document.getElementById('admin-remover-lista');
  container.innerHTML = '';
  if (!lista.length) { container.innerHTML = '<p style="color:#888">Nenhum produto.</p>'; return; }
  lista.forEach((p, i) => {
    container.innerHTML += `<div style="margin-bottom:1rem;display:flex;align-items:center;gap:1rem;">
      <img src="${p.imagem}" alt="${p.nome}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;">
      <b>${p.nome}</b>
      <button onclick="removerProduto(${i});renderRemoverAdmin();">Remover</button>
    </div>`;
  });
}

function removerProduto(idx) {
  const lista = getProdutos();
  lista.splice(idx, 1);
  setProdutos(lista);
  renderAdminLista();
}

document.addEventListener('DOMContentLoaded', function() {
  // Limpar produtos antigos de exemplo se existirem
  if (Array.isArray(getProdutos()) && getProdutos().length && getProdutos()[0].id) {
    setProdutos([]);
  }
});
