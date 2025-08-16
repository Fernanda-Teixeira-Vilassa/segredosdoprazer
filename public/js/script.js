/* =========================================================================
   Segredos do Prazer — Homepage
   - Renderiza Boutique, Digitais, Cursos e Blog com base no data.js
   - Carrinho persistente (localStorage)
   - Delegação de eventos (sem onclick inline)
   - Checkout real (Shopify/WooCommerce) se IDs estiverem configurados
   ========================================================================= */

/* ---------- Utils ---------- */
const BRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
const $  = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

const imgFallback = (src, alt) => src
  ? `<img src="${src}" alt="${alt ? String(alt).replace(/"/g, "&quot;") : ""}">`
  : `<div class="ph" aria-hidden="true"></div>`;

const labelCategoria = (cat) => {
  switch ((cat || '').toLowerCase()) {
    case 'feminino':   return 'Feminino';
    case 'masculino':  return 'Masculino';
   
