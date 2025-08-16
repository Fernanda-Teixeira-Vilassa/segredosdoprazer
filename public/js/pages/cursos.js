// cursos.js — listagem de cursos/workshops
const BRL = (v) => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v);
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const CATALOG = window.CATALOG || [];
const ALL = CATALOG.filter(p => p.type === 'curso');

let cart = JSON.parse(localStorage.getItem('sp_cart') || '[]');

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

function cardCurso(p){
  const categoria = p.topic || 'Curso';
  const badge = p.nivel ? `<span class="tag">${p.nivel}</span>` : '';
  const dur = p.duracao ? `<span class="tag">${p.duracao}</span>` : '';
  return `
  <div class="card">
    <div class="card__media"><div class="ph" aria-hidden="true"></div></div>
    <div class="card__body">
      <div class="card__title">${p.name}</div>
      <div class="card__meta"><span class="tag">${categoria}</span><span class="price">${BRL(p.price)}</span></div>
      <p class="section__subtitle" style="margin:0">${p.description || ''}</p>
      <div style="display:flex; gap:6px; margin-top:8px">${badge}${dur}</div>
    </div>
    <div class="card__actions">
      <button class="btn btn--primary" onclick="addToCart('${p.id}')">Adicionar</button>
      <a class="btn btn--secondary" href="course.html?id=${encodeURIComponent(p.id)}">Detalhes</a>
    </div>
  </div>`;
}

function applyFilters(){
  const q = $('#searchInput').value.trim().toLowerCase();
  const cat = $('#catSelect').value;
  const sort = $('#sortSelect').value;

  let list = ALL.slice();
  if(cat !== 'all') list = list.filter(p => (p.topic||'').toLowerCase() === cat);

  if(q) list = list.filter(p => {
    const text = (p.name + ' ' + (p.description||'') + ' ' + (p.aulas||[]).join(' ')).toLowerCase();
    return text.includes(q);
  });

  if(sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
  if(sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
  if(sort === 'name-asc') list.sort((a,b)=>a.name.localeCompare(b.name));

  $('#coursesGrid').innerHTML = list.map(cardCurso).join('');
}

function addToCart(id){
  const p = CATALOG.find(x=>x.id===id);
  if(!p) return;
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.qty += 1;
  else cart.push({ id:p.id, name:p.name, price:p.price, qty:1 });
  saveCart(); updateCartUI(); openCart();
}

function init(){
  updateCartUI();
  applyFilters();
  $('#openCartBtn').addEventListener('click', openCart);
  $('#closeCartBtn').addEventListener('click', closeCart);
  $('#overlay').addEventListener('click', closeCart);

  $('#searchInput').addEventListener('input', applyFilters);
  $('#catSelect').addEventListener('change', applyFilters);
  $('#sortSelect').addEventListener('change', applyFilters);
}
document.addEventListener('DOMContentLoaded', init);
