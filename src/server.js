
/**
 * server.js — Checkout Próprio + Assinatura VIP (Mercado Pago)
 * Requisitos:
 *   npm i express cors body-parser dotenv mercadopago node-fetch
 * Variáveis (.env):
 *   MP_ACCESS_TOKEN=...
 *   MP_WEBHOOK_SECRET=...   # segredo do webhook (Configurar em Preferências > Webhooks)
 *   PUBLIC_URL=https://seu-dominio.com  # usado para back_url/retorno
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== Mercado Pago SDK =====
const mercadopago = require('mercadopago');
if (!process.env.MP_ACCESS_TOKEN) {
  console.warn('[WARN] Defina MP_ACCESS_TOKEN no .env para habilitar pagamentos.');
}
mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN || '' });

// ===== Mock simples (substitua por DB em produção) =====
const ORDERS = new Map();      // orderId -> { ...pedido }
const SUBSCRIPTIONS = new Map(); // preapproval_id -> { email, status, started_at }

// ===== Catálogo básico (em prod., busque de DB) =====
const CATALOG = [
  { id:'p1', name:'Sugador Clitoriano X', price:349.9, type:'fisico' },
  { id:'d1', name:'E-book: 50 Ideias para Apimentar a Relação', price:39.9, type:'digital' },
  { id:'c1', name:'Curso de Pompoarismo — Iniciante', price:199.9, type:'curso' }
];

function BRL(n){ return Math.round(n*100)/100; }

/** ==============================
 *  1) Sessão de pagamento avulso (Pix/Cartão) - Checkout Pro
 *  ============================== */
app.post('/api/checkout/session', async (req, res) => {
  try {
    const { customer, cart, payment } = req.body || {};
    if(!customer?.email || !Array.isArray(cart) || !cart.length){
      return res.status(400).json({ error: 'Dados insuficientes' });
    }
    const items = cart.map(i => {
      const p = CATALOG.find(x=>x.id===i.id);
      if(!p) return null;
      return { title: p.name, unit_price: BRL(p.price), quantity: Number(i.qty||1), currency_id: 'BRL' };
    }).filter(Boolean);
    const total = items.reduce((a,i)=>a + i.unit_price*i.quantity, 0);

    // Preferência do Checkout Pro (cartão / Pix / boleto)
    const preference = {
      items,
      payer: { email: customer.email, name: customer.name || '' },
      back_urls: {
        success: (process.env.PUBLIC_URL || 'http://localhost:3000') + '/checkout.html?status=success',
        failure: (process.env.PUBLIC_URL || 'http://localhost:3000') + '/checkout.html?status=failure',
        pending: (process.env.PUBLIC_URL || 'http://localhost:3000') + '/checkout.html?status=pending',
      },
      auto_return: 'approved',
      statement_descriptor: 'SEGREDOS PRAZER',
      notification_url: (process.env.PUBLIC_URL || 'http://localhost:3000') + '/api/webhooks/mercadopago'
    };

    const pref = await mercadopago.preferences.create(preference);
    const orderId = 'ord_' + Date.now();
    ORDERS.set(orderId, { id: orderId, customer, items, total, status: 'pending', mp_preference_id: pref.body.id });

    return res.json({ order_id: orderId, mode: 'card', redirect_url: pref.body.init_point });
  } catch (err) {
    console.error('checkout/session error', err);
    return res.status(500).json({ error: 'Falha ao criar sessão de pagamento' });
  }
});

/** ==================================
 *  2) Assinatura VIP — Preapproval API
 *  ================================== */
app.post('/api/subscriptions/create', async (req, res) => {
  try {
    const { email, reason, amount } = req.body || {};
    if(!email) return res.status(400).json({ error: 'Informe email' });

    const price = Number(amount || process.env.VIP_PRICE || 29.9);
    const back = (process.env.PUBLIC_URL || 'http://localhost:3000') + '/account.html';

    const payload = {
      payer_email: email,
      back_url: back,                       // redireciona após aprovar
      reason: reason || 'Assinatura Quarto Secreto',
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: price,
        currency_id: 'BRL'
      },
      status: 'pending' // criado como pendente; usuário autoriza no redirect_url
    };

    const resp = await mercadopago.preapproval.create(payload);
    const pre = resp.body;
    SUBSCRIPTIONS.set(pre.id, { email, status: pre.status, started_at: new Date().toISOString() });

    return res.json({
      preapproval_id: pre.id,
      redirect_url: pre.init_point || pre.sandbox_init_point || back
    });
  } catch (err) {
    console.error('subscriptions/create error', err?.response?.body || err);
    return res.status(500).json({ error: 'Falha ao criar assinatura' });
  }
});

/** ==================================
 *  3) Webhook Mercado Pago (pagamentos + assinatura)
 *  Habilite a URL em Preferências > Webhooks e defina o mesmo MP_WEBHOOK_SECRET
 *  ================================== */
function verifyWebhook(req){
  // Verificação simplificada. Em produção, valide assinatura (x-signature) conforme docs do MP.
  // Exemplo: const sig = req.headers['x-signature']; validar HMAC com MP_WEBHOOK_SECRET.
  return Boolean(process.env.MP_WEBHOOK_SECRET);
}

app.post('/api/webhooks/mercadopago', async (req, res) => {
  try {
    if(!verifyWebhook(req)) return res.status(401).json({ error: 'invalid signature' });
    const event = req.body;
    // console.log('MP Webhook:', JSON.stringify(event));

    if(event?.type === 'preapproval'){
      // Atualiza status da assinatura
      const data = event?.data?.id;
      if(data){
        // Buscar detalhes atuais (opcional)
        try {
          const det = await mercadopago.preapproval.findById(data);
          const st = det.body?.status || 'unknown';
          SUBSCRIPTIONS.set(data, { ...(SUBSCRIPTIONS.get(data)||{}), status: st });
        } catch(e){}
      }
    }

    if(event?.type === 'payment'){
      // Emissão de fulfillment de pedidos pagos (opcional)
      // Você pode consultar o pagamento, encontrar a preferência / order, e marcar como 'paid'.
      // Exemplo:
      // const paymentId = event.data.id;
      // const pay = await mercadopago.payment.findById(paymentId);
      // if(pay.body.status === 'approved'){ ... }
    }

    return res.json({ received: true });
  } catch (err) {
    console.error('webhook error', err);
    return res.status(500).json({ error: 'webhook failure' });
  }
});

/** ==================================
 *  4) Endpoint simples para consultar status da assinatura (frontend)
 *  ================================== */
app.get('/api/subscriptions/status/:preapprovalId', async (req, res) => {
  const id = req.params.preapprovalId;
  try {
    const det = await mercadopago.preapproval.findById(id);
    return res.json({ id, status: det.body.status });
  } catch (e) {
    const local = SUBSCRIPTIONS.get(id);
    if(local) return res.json({ id, status: local.status || 'unknown' });
    return res.status(404).json({ error: 'not found' });
  }
});

// ===== Server start =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor rodando na porta', PORT));
