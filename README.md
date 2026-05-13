Rede Elas — Função avaliação
Projeto simples de uma função de avaliação. A galera lê as histórias e pode dar Upvote (gostei) ou Downvote (não gostei).

⚙️ Como o código funciona?
O script.js puxa as postagens de um banco de dados de mentira (db.json).
Ele pega os upvotes, subtrai os downvotes e mostra o resultado. O sistema já é esperto: se o usuário tentar votar na mesma coisa duas vezes, ele cancela o voto.

🚀 Como rodar essa parada
Você vai precisar de um "servidor falso" rodando no fundo pra tela conseguir ler o db.json.

Passo a passo:

Instale o Node.js no seu PC (só baixar e dar "avançar").

Abra o terminal e instale o pacote do servidor rodando isso aqui:

npm install -g json-server
Pelo terminal, entre na pasta do projeto e ligue o banco de dados com esse comando:

npx json-server --watch db.json --port 3000
(Aviso: Deixe essa tela do terminal aberta e minimizada, se fechar, quebra tudo!)

Por fim, é só dar dois cliques no arquivo index.html para abrir no navegador. Pronto!