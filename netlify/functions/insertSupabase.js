// netlify/functions/insertSupabase.js

const { createClient } = require('@supabase/supabase-js');

// Substitua pelas suas credenciais reais
const SUPABASE_URL = 'https://gdcjncjeazrskkubaeah.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkY2puY2plYXpyc2trdWJhZWFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNDQ1NjMsImV4cCI6MjA1NzkyMDU2M30.lkpZiqGmrw7gbpRwXOZPb8FyIy2PWQU7QJW2akItJVY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function localToPostgres() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 19).replace('T', ' ');
}

exports.handler = async (event, context) => {
  try {
    // Tenta fazer o parse do corpo da requisição para obter os dados enviados
    let docData = {};
    if (event.body) {
      docData = JSON.parse(event.body);
    }

    // Garante que os dados essenciais sejam definidos (caso não sejam enviados, usa valores default)
    const doc = {
      DateTime_Envio: localToPostgres(),
      IP: docData.IP                     || "SEM_IP",  // ou você pode deixar em branco se desejar capturar IP via outra lógica
      Nome: docData.Nome                 || "SEM_NOME",
      Email: docData.Email               || "SEM_EMAIL",
      Teste: docData.Teste               || "SEM_TESTE",
      Versao: docData.Versao             || "SEM_VERSAO",
      Resposta: docData.Resposta         || "SEM_RESPOSTA"
    };

    // Insere no Supabase na Collection "RegistrosTestes"
    const { data, error } = await supabase
      .from("RegistrosTestes")
      .insert([doc]);

    if (error) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Erro ao inserir no Supabase",
          error: error.message,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Inserido com sucesso no Supabase!",
        inserted: data,
      }),
    };
  } catch (err) {
    console.error("Erro ao inserir no Supabase:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Erro ao inserir no Supabase (Exception)",
        error: err.message,
      }),
    };
  }
};
