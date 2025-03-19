// netlify/functions/getSupabaseRecords.js

const { createClient } = require('@supabase/supabase-js');

// Substitua pelos seus dados do Supabase
const SUPABASE_URL = 'https://gdcjncjeazrskkubaeah.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkY2puY2plYXpyc2trdWJhZWFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNDQ1NjMsImV4cCI6MjA1NzkyMDU2M30.lkpZiqGmrw7gbpRwXOZPb8FyIy2PWQU7QJW2akItJVY';


const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

exports.handler = async (event, context) => {
  try {
    // Obtem o email da query string
    const email = event.queryStringParameters && event.queryStringParameters.email;
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email is required" }),
      };
    }

    // Consulta a tabela "RegistrosTestes" para registros com o email informado
    const { data, error } = await supabase
      .from('RegistrosTestes')
      .select('*')
      .eq('Email', email);

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Erro ao consultar registros no Supabase:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
