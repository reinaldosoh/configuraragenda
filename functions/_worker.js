/**
 * Manipulador de requisições para Cloudflare Pages Functions
 * 
 * Este arquivo configura o roteamento para uma aplicação de página única (SPA)
 * garantindo que todas as rotas não-estáticas sejam redirecionadas para o index.html
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Verificar se é uma solicitação para um arquivo estático
    if (url.pathname.startsWith('/assets/') || 
        url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.css') ||
        url.pathname.endsWith('.ico') ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.jpg') ||
        url.pathname.endsWith('.svg') ||
        url.pathname === '/index.html') {
      // Deixar o Cloudflare Pages lidar com arquivos estáticos
      return env.ASSETS.fetch(request);
    }
    
    // Para todas as outras rotas, retornar o index.html (comportamento SPA)
    const response = await env.ASSETS.fetch(new URL('/index.html', url.origin));
    
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
