// netlify/functions/fauna-crud.js
const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context) => {
  // 1) Ler método HTTP e corpo (se for POST/PUT)
  const method = event.httpMethod
  let body = null
  if (method === 'POST' || method === 'PUT') {
    body = JSON.parse(event.body || '{}')
  }

  // 2) Obter a FAUNA_SECRET das variáveis de ambiente
  const faunaSecret = process.env.FAUNA_SECRET
  if (!faunaSecret) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'FAUNA_SECRET não encontrada nas variáveis de ambiente' }),
    }
  }

  // 3) Conectar no Fauna
  const client = new faunadb.Client({ secret: faunaSecret })

  // Exemplo: assumindo que você tenha um collection "items"
  // e um index "all_items" para listagem
  try {
    switch (method) {
      case 'GET':
        // Listar todos os documentos
        //  -> Exige que exista um index "all_items" que retorne todos
        const getAll = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index('all_items'))), // index ex: all_items
            q.Lambda('ref', q.Get(q.Var('ref')))
          )
        )
        return {
          statusCode: 200,
          body: JSON.stringify(getAll.data),
        }

      case 'POST':
        // Criar um novo documento no collection "items"
        //  -> body deve conter algo como { data: {title: "...", ...} }
        //  -> Se quiser gerar ID automático, não precisa de "id" no body
        const created = await client.query(
          q.Create(q.Collection('items'), {
            data: body.data || {},
          })
        )
        return {
          statusCode: 200,
          body: JSON.stringify(created),
        }

      case 'PUT':
        // Atualizar um documento
        //  -> Necessita "id" no body, ex: { id: "345078239045...", data: {...} }
        if (!body.id) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Falta o campo "id" no body para atualizar' }),
          }
        }
        const updated = await client.query(
          q.Update(q.Ref(q.Collection('items'), body.id), {
            data: body.data || {},
          })
        )
        return {
          statusCode: 200,
          body: JSON.stringify(updated),
        }

      case 'DELETE':
        // Exemplo: deletar via query param ?id=xxx
        const idToDelete = event.queryStringParameters.id
        if (!idToDelete) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Falta ?id=...' }),
          }
        }
        const deleted = await client.query(
          q.Delete(q.Ref(q.Collection('items'), idToDelete))
        )
        return {
          statusCode: 200,
          body: JSON.stringify(deleted),
        }

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Método não suportado' }),
        }
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    }
  }
}
