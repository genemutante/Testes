// netlify/functions/sendToFauna.js

const faunadb = require("faunadb");
const q = faunadb.query;

// Carregue a KEY do Fauna via variáveis de ambiente
// No Netlify, você configuraria FAUNA_SECRET em "Site settings > Build & deploy > Environment"
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET, // Ajuste o nome da variável de ambiente se quiser
});

exports.handler = async (event, context) => {
  try {
    // Exemplo: "dados fixos" que vamos inserir
    // Ou você pode parsear do body: JSON.parse(event.body)
    const doc = {
      DateTime_Envio: new Date().toISOString(),
      IP: "123.456.789",
      Nome: "Fulano de Tal",
      Email: "fulano@teste.com",
      Teste: "Exemplo",
      Versao: "v1",
      Resposta: "BBB",
    };

    // Insere no Fauna
    const result = await client.query(
      q.Create(
        q.Collection("RegistrosTestes"), // Ajuste para o nome da sua Collection
        { data: doc }
      )
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Inserido com sucesso no Fauna!",
        faunaResult: result,
      }),
    };
  } catch (err) {
    console.error("Erro ao inserir no Fauna:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Erro ao inserir no Fauna",
        error: err.message,
      }),
    };
  }
};
