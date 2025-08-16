// ---------- Utils ----------
const BRL = (v) => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v);
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// ---------- Mock de catálogo ----------
// Usando CATALOG global do data.js
const PRODUCTS = window.CATALOG || [
  // Boutique (físicos)
  { id:'p1',  name:'Sugador Clitoriano X', price:349.9, category:'feminino', type:'fisico', img:'' },
  { id:'p2',  name:'Vibrador Bullet Rose', price:129.9, category:'feminino', type:'fisico', img:'' },
  { id:'p3',  name:'Masturbador Realista Soft', price:289.9, category:'masculino', type:'fisico', img:'' },
  { id:'p4',  name:'Anel Peniano Vibratório', price:89.9,  category:'masculino', type:'fisico', img:'' },
  { id:'p5',  name:'Kit Iniciante Casal', price:219.9, category:'casal', type:'fisico', img:'' },
  { id:'p6',  name:'Óleo de Massagem Térmico', price:59.9, category:'acessorios', type:'fisico', img:'' },
  // Digitais
  { id:'d1', name:'E-book: 50 Ideias para Apimentar a Relação', price:39.9, category:'ebook', type:'digital', img:'' },
  { id:'d2', name:'Contos: Noites Proibidas (Vol. 1)', price:24.9, category:'conto', type:'digital', img:'' },
  { id:'d3', name:'Guia: Fantasias & Jogos a Dois', price:29.9, category:'ebook', type:'digital', img:'' },
  // Cursos
  { id:'c1', name:'Curso de Pompoarismo — Iniciante', price:199.9, category:'curso', type:'curso', img:'' },
  { id:'c2', name:'Massagem Sensual — Passo a Passo', price:149.9, category:'curso', type:'curso', img:'' },
  { id:'c3', name:'Técnicas de Sedução & Intimidade', price:129.9, category:'curso', type:'curso', img:'' },
];

// ---------- Estado ----------
const CART_KEY = 'sp_cart';
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

// ---------- Render helpers ----------
function productCard(p){
  return `
  <div class="card" data-id="${p.id}">
    <div class="card__media">
      <div class="ph" aria-hidden="true"></div>
    </div>
    <div class="card__body">
      <div class="card__title">${p.name}</div>
      <div class="card__meta">
        <span class="tag">${p.type === 'fisico' ? 'Físico' : p.type === 'digital' ? 'Digital' : 'Curso'}</span>
        <span class="price">${BRL(p.price)}</span>
      </div>
    </div>
    <div class="card__actions">
      <button class="btn btn--primary" onclick="addToCart('${p.id}')">Adicionar</button>
      <button class="btn btn--secondary" onclick="verDetalhes('${p.id}')">Detalhes</button>
    </div>
  </div>`;
}

function renderBoutique(){
  const q = ($('#searchInput')?.value || '').toLowerCase();
  const filter = $('#filterSelect')?.value || 'all';
  const sort = $('#sortSelect')?.value || 'pop';

  let items = PRODUCTS.filter(p => p.type === 'fisico');
  if (filter !== 'all') items = items.filter(p => p.category === filter);
  if (q) items = items.filter(p => p.name.toLowerCase().includes(q));

  if (sort === 'price-asc') items.sort((a,b)=>a.price-b.price);
  if (sort === 'price-desc') items.sort((a,b)=>b.price-a.price);
  if (sort === 'name-asc') items.sort((a,b)=>a.name.localeCompare(b.name));

  $('#productsGrid').innerHTML = items.map(productCard).join('');
}

function renderDigital(){
  const items = PRODUCTS.filter(p => p.type === 'digital');
  $('#digitalGrid').innerHTML = items.map(productCard).join('');
}

function renderCourses(){
  const items = PRODUCTS.filter(p => p.type === 'curso');
  $('#coursesGrid').innerHTML = items.map(productCard).join('');
}

// ---------- Carrinho ----------
function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function cartCount(){ return cart.reduce((acc,i)=>acc+i.qty,0); }
function cartSubtotal(){ return cart.reduce((acc,i)=>acc+i.qty*i.price,0); }

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const existing = cart.find(i=>i.id===id);
  if(existing){ existing.qty += 1; }
  else{ cart.push({ id:p.id, name:p.name, price:p.price, qty:1 }); }
  saveCart();
  updateCartUI();
  openCart();
}

function changeQty(id, delta){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty <= 0) cart = cart.filter(i=>i.id!==id);
  saveCart();
  updateCartUI();
}

function removeItem(id){
  cart = cart.filter(i=>i.id!==id);
  saveCart();
  updateCartUI();
}

function updateCartUI(){
  $('#cartCount').textContent = cartCount();
  $('#cartSubtotal').textContent = BRL(cartSubtotal());
  const html = cart.length ? cart.map(i => `
    <div class="cart-item">
      <div class="cart-item__media" aria-hidden="true"></div>
      <div>
        <div>${i.name}</div>
        <div class="tag">${BRL(i.price)}</div>
        <div class="qty" aria-label="Quantidade">
          <button onclick="changeQty('${i.id}', -1)" aria-label="Diminuir">−</button>
          <div>${i.qty}</div>
          <button onclick="changeQty('${i.id}', 1)" aria-label="Aumentar">+</button>
        </div>
      </div>
      <button class="icon-btn" onclick="removeItem('${i.id}')" aria-label="Remover">✕</button>
    </div>
  `).join('') : `<p style="color:var(--muted)">Seu carrinho está vazio.</p>`;
  $('#cartItems').innerHTML = html;
}

// ---------- Cart drawer ----------
function openCart(){
  $('#cartDrawer').classList.add('open');
  $('#overlay').hidden = false;
  $('#cartDrawer').setAttribute('aria-hidden','false');
}
function closeCart(){
  $('#cartDrawer').classList.remove('open');
  $('#overlay').hidden = true;
  $('#cartDrawer').setAttribute('aria-hidden','true');
}

// ---------- Detalhes (placeholder) ----------
function verDetalhes(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const page = p.type==='fisico' ? 'product.html' : (p.type==='digital' ? 'ebook.html' : 'course.html');
  window.location.href = `${page}?id=${encodeURIComponent(id)}`;
}

// Mantém alerta como fallback
function verDetalhes_OLD(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  alert(`${p.name}\n\nTipo: ${p.type}\nPreço: ${BRL(p.price)}\n\n(Preencha com descrição, materiais, instruções de uso e política de trocas.)`);
}

// ---------- Newsletter (demo) ----------
function handleNewsletter(){
  const email = $('#emailNews').value.trim();
  if(!email){ alert('Digite seu e-mail.'); return; }
  alert('Obrigada! Em breve você receberá seu guia por e-mail.');
  $('#emailNews').value='';
}

// ---------- Init ----------
function init(){
  renderBoutique();
  renderDigital();
  renderCourses();
  updateCartUI();

  // Listeners
  $('#searchInput').addEventListener('input', renderBoutique);
  $('#filterSelect').addEventListener('change', renderBoutique);
  $('#sortSelect').addEventListener('change', renderBoutique);

  $('#openCartBtn').addEventListener('click', openCart);
  $('#closeCartBtn').addEventListener('click', closeCart);
  $('#overlay').addEventListener('click', closeCart);
  $('#checkoutBtn').addEventListener('click', () => {
    alert('Checkout de demonstração. Integre com Shopify/WooCommerce ou um gateway de pagamento para finalizar.');
  });
  $('#btnNews').addEventListener('click', handleNewsletter);
}
document.addEventListener('DOMContentLoaded', init);


// ---------- Checkout real (Shopify / WooCommerce) ----------
// Constrói URL de checkout baseado nos IDs configurados nos produtos.
function buildCheckoutUrl(cart){
  const cfg = window.CHECKOUT || {};
  const mode = (cfg.mode || 'shopify').toLowerCase();

  if(mode === 'custom'){
    return 'checkout.html';
  }

  if(mode === 'shopify'){
    // Cart permalink: /cart/VARIANT_ID:QTY,VARIANT_ID:QTY
    const domain = cfg.shopify?.shopDomain;
    if(!domain) return null;
    const parts = [];
    for(const item of cart){
      const p = PRODUCTS.find(x=>x.id===item.id);
      if(p?.shopifyVariantId && p.shopifyVariantId !== 'NONE'){
        parts.push(`${p.shopifyVariantId}:${item.qty}`);
      } else {
        console.warn('Sem shopifyVariantId para', p?.id);
      }
    }
    if(!parts.length) return null;
    return `https://${domain}/cart/${parts.join(',')}`;
  }

  if(mode === 'woocommerce'){
    // Adiciona itens por querystring (pode variar por tema/plugins)
    const base = (cfg.woocommerce?.baseUrl || '').replace(/\/$/,''); 
    if(!base) return null;
    // Adiciona um por vez usando add-to-cart múltiplo (dependendo do plugin)
    // Aqui, fazemos fallback: redireciona para /carrinho após adicionar via local.
    // Melhor: usar um plugin de múltiplos add-to-cart.
    const ids = cart.map(i => {
      const p = PRODUCTS.find(x=>x.id===i.id);
      return p?.wooProductId && p.wooProductId !== 'NONE' ? `${p.wooProductId}:${i.qty}` : null;
    }).filter(Boolean);
    if(!ids.length) return null;
    // Rota fictícia para plugin multi-add. Ajuste para seu ambiente real.
    return `${base}/?add-many=${encodeURIComponent(ids.join(','))}`;
  }

  return null;
}

// Substitui o comportamento do botão de checkout do carrinho
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('checkoutBtn');
  if(btn){
    btn.addEventListener('click', () => {
      const url = buildCheckoutUrl(cart);
      if(url){
        window.location.href = url;
      } else {
        alert('Configure os IDs (Shopify variantId ou WooCommerce productId) em data.js para ativar o checkout.');
      }
    }, { once:false });
  }
});
