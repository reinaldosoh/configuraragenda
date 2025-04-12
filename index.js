/**
 * Manipulador de requisições para o Cloudflare Workers
 * Este script garante que todas as rotas sejam redirecionadas para o index.html
 * para que o React Router funcione corretamente
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Verifica se a requisição é para um arquivo estático
    if (url.pathname.includes('.')) {
      // Deixa o Cloudflare Workers lidar com arquivos estáticos normalmente
      return env.ASSETS.fetch(request);
    }
    
    // Para todas as outras rotas, retorna o index.html
    return env.ASSETS.fetch(`${url.origin}/index.html`);
  }
};
