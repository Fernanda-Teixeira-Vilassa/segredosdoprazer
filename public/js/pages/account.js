// account.js — área do assinante (demo)
(function(){
  const vipActive = localStorage.getItem('vip_active') === 'true';
  const gate = document.getElementById('gate');
  const member = document.getElementById('member');
  if(!vipActive){ gate.style.display = 'block'; return; }

  member.style.display = 'block';
  const since = localStorage.getItem('vip_since') || new Date().toISOString();
  const coupon = localStorage.getItem('vip_coupon') || (window.VIP && window.VIP.coupon) || 'VIP10';
  document.getElementById('vipSince').textContent = new Date(since).toLocaleDateString('pt-BR');
  document.getElementById('vipCoupon').textContent = coupon;

  // Carregar conteúdos VIP (demos vindos do CATALOG com tag vip:true)
  const CAT = (window.CATALOG || []);
  const exclusives = CAT.filter(p => p.vip === true).slice(0,6);
  const early = CAT.filter(p => p.preorder === true).slice(0,6);

  document.getElementById('vipContent').innerHTML = exclusives.length ?
    exclusives.map(x => `<li><a class="link" href="${x.type==='digital' ? 'ebook.html' : (x.type==='curso' ? 'course.html' : '#') }?id=${encodeURIComponent(x.id)}">${x.name}</a></li>`).join('')
    : '<li>Novo conteúdo em breve…</li>';

  document.getElementById('vipEarly').innerHTML = early.length ?
    early.map(x => `<li>${x.name} — <span class="tag">Prévia</span></li>`).join('')
    : '<li>Sem prévias no momento.</li>';

  document.getElementById('btnDesativar').addEventListener('click', ()=>{
    if(confirm('Deseja cancelar sua assinatura? (demonstração)')){
      localStorage.removeItem('vip_active');
      location.reload();
    }
  });
})();
