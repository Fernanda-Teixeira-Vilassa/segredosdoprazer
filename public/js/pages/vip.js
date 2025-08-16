// vip.js — assinatura real (Mercado Pago) com fallback demo
(function(){
  const priceEl = document.getElementById('vipPrice');
  const btn = document.getElementById('btnAssinar');
  const VIPCFG = window.VIP || { price: 29.9, coupon: 'VIP10', discount: 10 };
  const BRL = (v) => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v);

  priceEl.textContent = BRL(VIPCFG.price);

  btn.addEventListener('click', async (e)=>{
    e.preventDefault();
    const email = prompt('Digite seu e-mail para ativar a assinatura:');
    if(!email) return;

    try{
      // Tenta criar assinatura real no backend
      const resp = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason: 'Assinatura Quarto Secreto', amount: VIPCFG.price })
      });
      const data = await resp.json();
      if(data?.redirect_url){
        // Redireciona para aprovação no Mercado Pago
        window.location.href = data.redirect_url;
      } else {
        throw new Error('Sem redirect_url');
      }
    } catch(err){
      // Fallback: ativa demo local
      localStorage.setItem('vip_active','true');
      localStorage.setItem('vip_since', new Date().toISOString());
      localStorage.setItem('vip_coupon', VIPCFG.coupon);
      alert('Assinatura ativada em modo DEMO (falha ao chamar backend).');
      window.location.href = 'account.html';
    }
  });
})();
