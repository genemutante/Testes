// netlify/functions/insertFauna.js

const faunadb = require("faunadb");
const q = faunadb.query;

// Carregue a KEY do Fauna via variáveis de ambiente
// No Netlify, configure FAUNA_SECRET em "Site settings > Build & deploy > Environment"
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET,
});

exports.handler = async (event, context) => {
  try {
    // Exemplo de dados fixos (você pode substituir por dados vindos do event.body, se necessário)
    const doc = {
      DateTime_Envio: new Date().toISOString(),
      IP: "123.456.789",
      Nome: "Fulano de Tal",
      Email: "fulano@teste.com",
      Teste: "Exemplo",
      Versao: "v1",
      Resposta: "BBB",
    };

    // Insere no Fauna na Collection "RegistrosTestes"
    const result = await client.query(
      q.Create(
        q.Collection("RegistrosTestes"),
        { data: doc }
      )
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Inserido com sucesso no Fauna!",
        faunaResult: result,
      }),
    };
  } catch (err) {
    console.error("Erro ao inserir no Fauna:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Erro ao inserir no Fauna",
        error: err.message,
      }),
    };
  }
};
