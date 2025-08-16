
// ====== page-detail.js: render genérico de página de detalhe ======
const BRL = (v) => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v);
const $ = (sel) => document.querySelector(sel);

const params = new URLSearchParams(location.search);
const id = params.get('id');

const CATALOG = window.CATALOG || [];
let cart = JSON.parse(localStorage.getItem('sp_cart') || '[]');

function saveCart(){ localStorage.setItem('sp_cart', JSON.stringify(cart)); }
function cartCount(){ return cart.reduce((acc,i)=>acc+i.qty,0); }
function cartSubtotal(){ return cart.reduce((acc,i)=>acc+i.qty*i.price,0); }
function updateCartUI(){
  const elCount = document.getElementById('cartCount');
  if(elCount) elCount.textContent = cartCount();
  const elSub = document.getElementById('cartSubtotal');
  if(elSub) elSub.textContent = BRL(cartSubtotal());
  const itemsEl = document.getElementById('cartItems');
  if(!itemsEl) return;
  itemsEl.innerHTML = cart.length ? cart.map(i => `
    <div class="cart-item">
      <div class="cart-item__media"></div>
      <div>
        <div>${i.name}</div>
        <div class="tag">${BRL(i.price)}</div>
        <div class="qty">
          <button onclick="changeQty('${i.id}', -1)">−</button>
          <div>${i.qty}</div>
          <button onclick="changeQty('${i.id}', 1)">+</button>
        </div>
      </div>
      <button class="icon-btn" onclick="removeItem('${i.id}')">✕</button>
    </div>
  `).join('') : `<p style="color:var(--muted)">Seu carrinho está vazio.</p>`;
}

function changeQty(id, delta){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty <= 0) cart = cart.filter(i=>i.id!==id);
  saveCart(); updateCartUI();
}

function removeItem(id){
  cart = cart.filter(i=>i.id!==id);
  saveCart(); updateCartUI();
}

function openCart(){ document.getElementById('cartDrawer').classList.add('open'); document.getElementById('overlay').hidden = false; }
function closeCart(){ document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('overlay').hidden = true; }

function addToCart(prod){
  const existing = cart.find(i=>i.id===prod.id);
  if(existing) existing.qty += 1;
  else cart.push({ id:prod.id, name:prod.name, price:prod.price, qty:1 });
  saveCart(); updateCartUI(); openCart();
}

function renderDetail(p){
  const detail = document.getElementById('detail');
  if(!p){ detail.innerHTML = '<p>Produto não encontrado.</p>'; return; }
  detail.innerHTML = `
    <div class="grid" style="grid-template-columns: 1fr 1.2fr; align-items:start">
      <div class="card__media" style="height:340px"><div class="ph"></div></div>
      <div>
        <h2 class="section__title">${p.name}</h2>
        <div class="card__meta"><span class="tag">${p.type}</span><span class="price">${BRL(p.price)}</span></div>
        <p class="section__subtitle" style="margin-bottom:14px">${p.description || ''}</p>
        <div class="card__actions">
          <button class="btn btn--primary" id="btnAdd">Adicionar ao carrinho</button>
          <button class="btn btn--secondary" id="btnBuyNow">Comprar agora</button>
        </div>
        <div class="section" style="padding:20px 0 0">
          <h4>Detalhes</h4>
          <ul style="color:var(--muted)">
            <li>Envio discreto e rastreável.</li>
            <li>Troca em até 7 dias (produtos lacrados).</li>
            <li>Pagamento seguro.</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  document.getElementById('btnAdd').onclick = () => addToCart(p);
  document.getElementById('btnBuyNow').onclick = () => {
    addToCart(p);
    const url = buildCheckoutUrl(cart);
    if(url) location.href = url;
    else alert('Configure IDs do Shopify/WooCommerce em data.js.');
  };
}

function init(){
  const p = CATALOG.find(x=>x.id===id);
  renderDetail(p);
  updateCartUI();
  document.getElementById('openCartBtn').addEventListener('click', openCart);
  document.getElementById('closeCartBtn').addEventListener('click', closeCart);
  document.getElementById('overlay').addEventListener('click', closeCart);
}
document.addEventListener('DOMContentLoaded', init);

// Importa builder do checkout do index caso a página seja independente
// (redeclara aqui de forma mínima)
function buildCheckoutUrl(cart){
  const cfg = window.CHECKOUT || {};
  const mode = (cfg.mode || 'shopify').toLowerCase();

  if(mode === 'custom'){
    return 'checkout.html';
  }

  if(mode === 'shopify'){
    const domain = cfg.shopify?.shopDomain;
    if(!domain) return null;
    const parts = [];
    for(const item of cart){
      const p = CATALOG.find(x=>x.id===item.id);
      if(p?.shopifyVariantId && p.shopifyVariantId !== 'NONE'){
        parts.push(`${p.shopifyVariantId}:${item.qty}`);
      }
    }
    if(!parts.length) return null;
    return `https://${domain}/cart/${parts.join(',')}`;
  }
  if(mode === 'woocommerce'){
    const base = (cfg.woocommerce?.baseUrl || '').replace(/\/$/,''); 
    if(!base) return null;
    const ids = cart.map(i => {
      const p = CATALOG.find(x=>x.id===i.id);
      return p?.wooProductId && p.wooProductId !== 'NONE' ? `${p.wooProductId}:${i.qty}` : null;
    }).filter(Boolean);
    if(!ids.length) return null;
    return `${base}/?add-many=${encodeURIComponent(ids.join(','))}`;
  }
  return null;
}
