// post.js — renderização de artigo
const params = new URLSearchParams(location.search);
const id = params.get('id');
const POSTS = (window.CATALOG || []).filter(p => p.type === 'post');

function renderPost(p){
  const el = document.getElementById('postContainer');
  if(!p){ el.innerHTML = '<p>Artigo não encontrado.</p>'; return; }
  const d = new Date(p.date || Date.now());
  const dateStr = d.toLocaleDateString('pt-BR');
  el.innerHTML = `
    <header style="margin-bottom:12px">
      <h2 class="section__title" style="margin:0 0 4px">${p.title}</h2>
      <p class="section__subtitle" style="margin:0">${dateStr} • ${p.category||''}</p>
    </header>
    <div class="post-body">${p.content || p.excerpt || ''}</div>
  `;

  // share
  const shareUrl = location.href;
  document.getElementById('shareWhats').href = `https://wa.me/?text=${encodeURIComponent(p.title + ' ' + shareUrl)}`;
  document.getElementById('shareX').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(p.title)}&url=${encodeURIComponent(shareUrl)}`;

  // related
  const related = POSTS.filter(x => x.id !== p.id && (x.category === p.category)).slice(0,3);
  document.getElementById('relatedGrid').innerHTML = related.map(r => `
    <article class="blog-card">
      <h4>${r.title}</h4>
      <p class="section__subtitle">${new Date(r.date).toLocaleDateString('pt-BR')} • ${r.category||''}</p>
      <p>${r.excerpt||''}</p>
      <a class="link" href="post.html?id=${encodeURIComponent(r.id)}">Ler →</a>
    </article>`).join('');
}

function init(){
  const p = POSTS.find(x => x.id === id);
  renderPost(p);
}
document.addEventListener('DOMContentLoaded', init);
