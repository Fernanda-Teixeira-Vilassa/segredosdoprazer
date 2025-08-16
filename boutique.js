// boutique.js — listagem com filtros, busca e paginação
const BRL = (v) => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v);
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const CATALOG = window.CATALOG || [];
const ALL = CATALOG.filter(p => p.type === 'fisico');

// Estado
let cart = JSON.parse(localStorage.getItem('sp_cart') || '[]');
let page = 1;
const pageSize = 8;
let lastList = ALL.slice();

function saveCart(){ localStorage.setItem('sp_cart', JSON.stringify(cart)); }
function cartCount(){ return cart.reduce((a,i)=>a+i.qty,0); }
function cartSubtotal(){ return cart.reduce((a,i)=>a+i.qty*i.price,0); }
function updateCartUI(){
  $('#cartCount').textContent = cartCount();
  $('#cartSubtotal').textContent = BRL(cartSubtotal());
  const html = cart.length ? cart.map(i => `
    <div class="cart-item">
      <div class="cart-item__media"></div>
      <div>
        <div>${i.name}</div>
        <div class="tag">${BRL(i.price)}</div>
        <div class="qty">
          <button onclick="changeQty('${i.id}',-1)">−</button>
          <div>${i.qty}</div>
          <button onclick="changeQty('${i.id}',1)">+</button>
        </div>
      </div>
      <button class="icon-btn" onclick="removeItem('${i.id}')">✕</button>
    </div>
  `).join('') : `<p style="color:var(--muted)">Seu carrinho está vazio.</p>`;
  $('#cartItems').innerHTML = html;
}
function changeQty(id, delta){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty <= 0) cart = cart.filter(i=>i.id!==id);
  saveCart(); updateCartUI();
}
function removeItem(id){ cart = cart.filter(i=>i.id!==id); saveCart(); updateCartUI(); }
function openCart(){ $('#cartDrawer').classList.add('open'); $('#overlay').hidden = false; }
function closeCart(){ $('#cartDrawer').classList.remove('open'); $('#overlay').hidden = true; }

// Renderização
function productCard(p){
  return `
    <div class="card">
      <div class="card__media"><div class="ph" aria-hidden="true"></div></div>
      <div class="card__body">
        <div class="card__title">${p.name}</div>
        <div class="card__meta"><span class="tag">${p.category}</span><span class="price">${BRL(p.price)}</span></div>
      </div>
      <div class="card__actions">
        <button class="btn btn--primary" onclick="addToCart('${p.id}')">Adicionar</button>
        <a class="btn btn--secondary" href="product.html?id=${encodeURIComponent(p.id)}">Detalhes</a>
      </div>
    </div>
  `;
}

function applyFilters(){
  const cats = $$('.flt-cat:checked').map(x=>x.value);
  const q = $('#searchInput').value.trim().toLowerCase();
  const min = parseFloat($('#priceMin').value || '0');
  const max = parseFloat($('#priceMax').value || '0');
  const sort = $('#sortSelect').value;

  let list = ALL.filter(p => cats.includes(p.category));
  if(q)  list = list.filter(p => p.name.toLowerCase().includes(q));
  if(min) list = list.filter(p => p.price >= min);
  if(max) list = list.filter(p => p.price <= max);

  if(sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
  if(sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
  if(sort === 'name-asc') list.sort((a,b)=>a.name.localeCompare(b.name));

  lastList = list;
  page = 1;
  renderPage();
}

function renderPage(){
  const total = lastList.length;
  const start = (page-1)*pageSize;
  const items = lastList.slice(start, start + pageSize);
  $('#productsGrid').innerHTML = items.map(productCard).join('');
  $('#resultMeta').textContent = `${total} resultado(s) • mostrando ${items.length} item(ns)`;
  $('#pageInfo').textContent = `Página ${page}`;
  $('#prevPage').disabled = page <= 1;
  $('#nextPage').disabled = start + pageSize >= total;
}

function addToCart(id){
  const p = CATALOG.find(x=>x.id===id);
  if(!p) return;
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.qty += 1;
  else cart.push({ id:p.id, name:p.name, price:p.price, qty:1 });
  saveCart(); updateCartUI(); openCart();
}

// Eventos
function init(){
  updateCartUI();
  applyFilters();
  // Botões
  $('#applyBtn').addEventListener('click', applyFilters);
  $('#clearBtn').addEventListener('click', () => {
    $$('.flt-cat').forEach(x=>x.checked = true);
    $('#priceMin').value = ''; $('#priceMax').value = ''; $('#searchInput').value = '';
    $('#sortSelect').value = 'pop'; applyFilters();
  });
  $('#prevPage').addEventListener('click', ()=>{ if(page>1){ page--; renderPage(); } });
  $('#nextPage').addEventListener('click', ()=>{
    const maxPage = Math.ceil(lastList.length / pageSize);
    if(page < maxPage){ page++; renderPage(); }
  });
  // Cart
  $('#openCartBtn').addEventListener('click', openCart);
  $('#closeCartBtn').addEventListener('click', closeCart);
  $('#overlay').addEventListener('click', closeCart);
}
document.addEventListener('DOMContentLoaded', init);
