/**
 * Função de captura para todas as rotas
 * Este script garante que todas as rotas sejam tratadas corretamente
 */
export async function onRequest(context) {
  // Obter a URL da requisição
  const url = new URL(context.request.url);
  
  // Log para debug
  console.log(`Função [[path]].js - Recebendo requisição para: ${url.toString()}`);
  
  // Retornar o index.html para todas as rotas não estáticas
  const response = await context.env.ASSETS.fetch('https://agendaiprevenir.bunnycriativo.workers.dev/index.html');
  
  // Criar uma nova resposta com os cabeçalhos CORS
  const newResponse = new Response(response.body, response);
  
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  newResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  return newResponse;
}
