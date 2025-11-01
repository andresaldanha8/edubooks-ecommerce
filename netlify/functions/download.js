// Função Netlify para liberar download seguro após pagamento aprovado no Mercado Pago
// Substitua 'SEU_ACCESS_TOKEN' pelo seu Access Token de produção do Mercado Pago

const crypto = require('crypto');
const fetch = require('node-fetch');

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN; // Defina MP_ACCESS_TOKEN nas variáveis de ambiente do Netlify
const validPayments = {};

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    const { email, product, paymentId } = JSON.parse(event.body);

    // Valida pagamento no Mercado Pago
    const paymentInfo = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    }).then(res => res.json());

    if (paymentInfo.status === 'approved') {
      // Gera token temporário
      const token = crypto.randomBytes(16).toString('hex');
      validPayments[token] = { product, email, expires: Date.now() + 10 * 60 * 1000 };
      return {
        statusCode: 200,
        body: JSON.stringify({
          downloadUrl: `/api/download?token=${token}`
        })
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Pagamento não aprovado.' })
      };
    }
  }

  // GET para download
  if (event.httpMethod === 'GET') {
    const { token } = event.queryStringParameters;
    const info = validPayments[token];
    if (info && info.expires > Date.now()) {
      const filePath = `ebooks/${info.product}.pdf`;
      return {
        statusCode: 302,
        headers: {
          Location: `/${filePath}`
        },
        body: ''
      };
    } else {
      return {
        statusCode: 403,
        body: 'Link expirado ou inválido.'
      };
    }
  }

  return {
    statusCode: 405,
    body: 'Método não permitido.'
  };
};
