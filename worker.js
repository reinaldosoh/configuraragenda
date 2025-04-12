/**
 * Worker para o Cloudflare Workers
 * Este script garante que todas as rotas sejam redirecionadas para o index.html
 * para que o React Router funcione corretamente
 */

// Lista de tipos de arquivos estáticos que devem ser servidos diretamente
const STATIC_EXTENSIONS = [
  'css', 'js', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'ico', 'woff', 'woff2', 'ttf', 'eot', 'map', 'json'
];

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      
      // Verificar se é uma solicitação para um arquivo estático
      const extension = path.split('.').pop().toLowerCase();
      if (STATIC_EXTENSIONS.includes(extension)) {
        // Servir o arquivo estático normalmente
        return fetch(request);
      }
      
      // Para todas as outras rotas, retornar o index.html
      const response = await fetch(new URL('/index.html', url.origin));
      
      // Criar uma nova resposta com os cabeçalhos CORS
      const newResponse = new Response(response.body, response);
      
      // Adicionar cabeçalhos para evitar problemas de cache e CORS
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      newResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      
      return newResponse;
    } catch (error) {
      // Em caso de erro, retornar uma resposta de erro
      return new Response(`Erro no servidor: ${error.message}`, {
        status: 500,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  }
};
