/**
 * Worker script para o Cloudflare Workers
 * Este script garante que todas as rotas sejam redirecionadas para o index.html
 * para que o React Router funcione corretamente
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Se for um arquivo estático (com extensão), servir normalmente
    if (path.match(/\.\w+$/)) {
      return fetch(request);
    }

    // Para todas as outras rotas, retornar o index.html
    return fetch(new URL('/index.html', url.origin));
  }
};
