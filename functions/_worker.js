/**
 * Manipulador de requisições para Cloudflare Pages Functions
 * 
 * Configuração simplificada para aplicação SPA no Cloudflare Pages
 */

export function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Se a rota não for um arquivo estático, servir o index.html
  if (!url.pathname.includes('.')) {
    return context.env.ASSETS.fetch('/index.html', context.request);
  }
  
  // Para arquivos estáticos, deixar o Cloudflare Pages lidar
  return context.next();
}
