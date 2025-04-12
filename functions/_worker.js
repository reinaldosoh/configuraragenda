// Manipulador simples para todas as requisições
export function onRequest({ request, next }) {
  // Obter a URL da requisição
  const url = new URL(request.url);
  
  // Se for um arquivo estático, passar para o próximo handler
  if (url.pathname.includes('.')) {
    return next();
  }
  
  // Para todas as outras rotas, redirecionar para a mesma URL mas com index.html
  const newUrl = new URL('/index.html', url.origin);
  return Response.redirect(newUrl.toString(), 302);
}
