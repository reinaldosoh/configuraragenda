/**
 * Worker script para o Cloudflare Workers
 * Este script garante que todas as rotas sejam redirecionadas para o index.html
 * para que o React Router funcione corretamente, incluindo em WebViews do Flutter
 */
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      
      // Log para debug
      console.log(`Recebendo requisição para: ${url.toString()}`);

      // Se for um arquivo estático (com extensão), servir normalmente
      if (path.match(/\.\w+$/)) {
        console.log(`Servindo arquivo estático: ${path}`);
        return fetch(request);
      }

      // Para todas as outras rotas, retornar o index.html preservando os parâmetros de consulta
      const indexUrl = new URL('/index.html', url.origin);
      
      // Preservar os parâmetros de consulta originais
      url.searchParams.forEach((value, key) => {
        indexUrl.searchParams.append(key, value);
      });
      
      console.log(`Redirecionando para: ${indexUrl.toString()}`);
      
      // Adicionar headers para evitar problemas de cache e CORS
      const headers = new Headers();
      headers.set('Content-Type', 'text/html');
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');
      
      // Criar uma nova requisição para o index.html
      const indexRequest = new Request(indexUrl.toString(), {
        method: 'GET',
        headers: headers
      });
      
      return fetch(indexRequest);
    } catch (error) {
      console.error(`Erro no worker: ${error.message}`);
      return new Response(`Erro no servidor: ${error.message}`, {
        status: 500,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  }
};
