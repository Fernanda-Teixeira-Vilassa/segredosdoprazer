// blog.js — listagem de posts do blog
const $  = (sel) => document.querySelector(sel);

const POSTS = (window.CATALOG || []).filter(p => p.type === 'post');

let page = 1;
const pageSize = 9;
let lastList = POSTS.slice();

function cardPost(p){
  const d = new Date(p.date || Date.now());
  const dateStr = d.toLocaleDateString('pt-BR');
  return `
  <article class="blog-card">
    <h4>${p.title}</h4>
    <p class="section__subtitle" style="margin:0 0 6px">${dateStr} • ${p.category || ''}</p>
    <p>${p.excerpt || ''}</p>
    <a class="link" href="post.html?id=${encodeURIComponent(p.id)}">Leia mais →</a>
  </article>`;
}

function applyFilters(){
  const q = (document.getElementById('searchInput').value || '').trim().toLowerCase();
  const cat = document.getElementById('catSelect').value;
  const sort = document.getElementById('sortSelect').value;

  let list = POSTS.slice();
  if(cat !== 'all') list = list.filter(p => (p.category||'').toLowerCase().includes(cat.toLowerCase()));
  if(q){
    list = list.filter(p => {
      const text = (p.title + ' ' + (p.excerpt||'') + ' ' + (p.content||'')).toLowerCase();
      return text.includes(q);
    });
  }

  if(sort.startsWith('date')){
    list.sort((a,b) => (new Date(a.date)) - (new Date(b.date)));
    if(sort.endsWith('desc')) list.reverse();
  } else if(sort.startsWith('pop')){
    list.sort((a,b) => (a.popularity||0) - (b.popularity||0));
    if(sort.endsWith('desc')) list.reverse();
  }

  lastList = list;
  page = 1;
  renderPage();
}

function renderPage(){
  const start = (page-1)*pageSize;
  const items = lastList.slice(start, start+pageSize);
  document.getElementById('postsGrid').innerHTML = items.map(cardPost).join('');
  document.getElementById('pageInfo').textContent = `Página ${page}`;
  document.getElementById('prevPage').disabled = page <= 1;
  document.getElementById('nextPage').disabled = start + pageSize >= lastList.length;
}

function init(){
  applyFilters();
  document.getElementById('prevPage').addEventListener('click', () => { if(page>1){ page--; renderPage(); } });
  document.getElementById('nextPage').addEventListener('click', () => {
    const maxPage = Math.ceil(lastList.length / pageSize);
    if(page < maxPage){ page++; renderPage(); }
  });
  document.getElementById('searchInput').addEventListener('input', applyFilters);
  document.getElementById('catSelect').addEventListener('change', applyFilters);
  document.getElementById('sortSelect').addEventListener('change', applyFilters);
}
document.addEventListener('DOMContentLoaded', init);
