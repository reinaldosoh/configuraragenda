/**
 * Middleware para o Cloudflare Pages Functions
 * Este script intercepta todas as requisições e garante que o React Router funcione corretamente
 */
export async function onRequest(context) {
  // Obter a URL da requisição
  const url = new URL(context.request.url);
  const path = url.pathname;
  
  // Log para debug
  console.log(`Recebendo requisição para: ${url.toString()}`);
  
  // Se for um arquivo estático (com extensão), passar adiante
  if (path.match(/\.\w+$/)) {
    console.log(`Servindo arquivo estático: ${path}`);
    return context.next();
  }
  
  // Para todas as outras rotas, redirecionar para o index.html
  const indexUrl = new URL('/index.html', url.origin);
  
  // Preservar os parâmetros de consulta originais
  url.searchParams.forEach((value, key) => {
    indexUrl.searchParams.append(key, value);
  });
  
  console.log(`Redirecionando para: ${indexUrl.toString()}`);
  
  // Criar uma nova requisição para o index.html
  const indexRequest = new Request(indexUrl, {
    method: 'GET',
    headers: context.request.headers
  });
  
  // Adicionar cabeçalhos CORS
  const response = await fetch(indexRequest);
  const newResponse = new Response(response.body, response);
  
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  newResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  return newResponse;
}
