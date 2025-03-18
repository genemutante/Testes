const faunadb = require('faunadb')
const q = faunadb.query

// Sua key gerada no Fauna
const client = new faunadb.Client({
  secret: 'SUA_KEY_AQUI',
})

// Exemplo de inserir um documento
async function createDocument() {
  try {
    const result = await client.query(
      q.Create(
        q.Collection("RegistrosTestes"),
        {
          data: {
            DateTime_Envio: "14/03/2025 12:03",
            IP: "123",
            Nome: "Renato",
            Email: "3beci@ggf.com",
            Teste: "Sabotadores",
            Versao: "v1",
            Resposta: "ABCS"
          }
        }
      )
    )
    console.log("Documento criado:", result)
  } catch (err) {
    console.error("Erro ao criar documento:", err)
  }
}

createDocument()
