const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
// Adicione um rewrite para que o Vercel entenda as rotas
server.use(jsonServer.rewriter({
    '/api/*': '/$1'
}));
server.use(router);

module.exports = server;