export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Verificar se é uma solicitação para um arquivo estático
    if (url.pathname.startsWith('/assets/') || 
        url.pathname === '/index.html' || 
        url.pathname === '/favicon.ico') {
      return fetch(request);
    }
    
    // Para todas as outras rotas, retornar o index.html
    const response = await fetch(new URL('/index.html', url.origin));
    
    // Criar uma nova resposta com os cabeçalhos CORS
    const newResponse = new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
    return newResponse;
  }
};
