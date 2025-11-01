// Função serverless Netlify para criar preferência de pagamento Mercado Pago (PIX)
// Salve este arquivo como create-preference.js em netlify/functions/

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

    // Lê o Access Token do Mercado Pago da variável de ambiente
    const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
    if (!ACCESS_TOKEN) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Access Token do Mercado Pago não configurado nas variáveis de ambiente.' }),
      };
    }

  const body = JSON.parse(event.body);
  const { title, price, email } = body;

  const preference = {
    items: [
      {
        title: title || 'Ebook EduBooks',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: Number(price),
      },
    ],
    payer: {
      email: email,
    },
    payment_methods: {
      excluded_payment_types: [{ id: 'ticket' }],
      installments: 1,
    },
    statement_descriptor: 'EDUBOOKS',
    notification_url: '', // opcional
  };

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });
    const data = await response.json();
    if (data.id) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          id: data.id,
          init_point: data.init_point,
          sandbox_init_point: data.sandbox_init_point,
          qr_code: data.point_of_interaction?.transaction_data?.qr_code,
          qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64,
        }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
