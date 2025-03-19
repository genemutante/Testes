const faunadb = require("faunadb");
const q = faunadb.query;

// Coloque aqui a sua chave de role "admin" ou a "server" com permissão
const client = new faunadb.Client({
  secret: "fnAF6MkSNjAAzh1Swemo5NG8pFK9YzQgrBjJIQhb"
});

async function main() {
  try {
    // Teste de inserção de um doc fixo
    const doc = {
      teste: "Funciona?",
      quando: new Date().toISOString()
    };

    const result = await client.query(
      q.Create(
        q.Collection("RegistrosTestes"), // AJUSTE para o nome da sua Collection
        { data: doc }
      )
    );

    console.log("Inserido com sucesso:", result);
  } catch (err) {
    console.error("Erro ao inserir no Fauna:", err);
  }
}

main();
