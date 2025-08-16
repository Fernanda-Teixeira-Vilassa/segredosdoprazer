
# Assinatura VIP com Mercado Pago — Guia Rápido

1) Instale dependências:
   npm i express cors body-parser dotenv mercadopago node-fetch

2) Configure `.env`:
   MP_ACCESS_TOKEN=seu_token
   MP_WEBHOOK_SECRET=um_segredo
   PUBLIC_URL=https://seu-dominio.com

3) No painel do Mercado Pago:
   - Ative **Checkout Pro** e **Assinaturas (Preapproval)**.
   - Em **Webhooks**, defina: `https://seu-dominio.com/api/webhooks/mercadopago`
     e o mesmo `MP_WEBHOOK_SECRET` do .env.

4) Rode o servidor:
   node server.js

5) Teste a assinatura:
   - Abra `vip.html` na sua hospedagem (mesmo domínio do PUBLIC_URL).
   - Clique em "Assinar agora", informe seu e-mail e aprove a cobrança no MP.

6) Webhook:
   - O MP enviará eventos para `/api/webhooks/mercadopago`.
   - Atualize a lógica para persistir status no banco e liberar acesso real.

⚠️ Segurança:
- Valide a **assinatura** do webhook (cabeçalho `x-signature`) usando `MP_WEBHOOK_SECRET`.
- Salve assinaturas/usuários em DB e use autenticação de sessão/JWT na área do assinante.
