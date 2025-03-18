// netlify/functions/insertFauna.js

const faunadb = require("faunadb");
const q = faunadb.query;

// >>> COLOQUE SUA CHAVE DIRETAMENTE AQUI <<<
const client = 
new faunadb.Client({
  secret: "fnAF6MUveHAAQKY-p2m5F1ahncfkxZVZiNM0ROyH",
  domain: "db.us.fauna.com",
  scheme: "https",
});




exports.handler = async (event, context) => {
  try {
    // Exemplo de documento fixo a ser inserido
    const doc = {
      DateTime_Envio: new Date().toISOString(),
      IP: "123.456.789",
      Nome: "Fulano de Tal",
      Email: "fulano@teste.com",
      Teste: "Exemplo",
      Versao: "v1",
      Resposta: "BBB",
    };

    // Insere no Fauna (ajuste o nome da Collection conforme o que criou)
    const result = await client.query(
      q.Create(
        q.Collection("RegistrosTestes"), 
        { data: doc }
      )
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" }, // boa prática
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
