const API_POSTS = '/api/postagens';
const API_VOTOS = '/api/avaliacoes';

const USUARIO_LOGADO_ID = 1; 

window.onload = () => {
    carregarDados();
};

function carregarDados() {
    Promise.all([
        fetch(API_POSTS).then(res => res.json()),
        fetch(API_VOTOS).then(res => res.json())
    ]).then(([postagens, avaliacoes]) => {
        renderizarFeed(postagens, avaliacoes);
    });
}

function renderizarFeed(postagens, avaliacoes) {
    const feed = document.getElementById('feedRelatos');
    feed.innerHTML = '';

    postagens.forEach(post => {
        const upvotes = avaliacoes.filter(v => v.postagemId.toString() === post.id.toString() && v.tipoVoto === 'upvote').length;
        const downvotes = avaliacoes.filter(v => v.postagemId.toString() === post.id.toString() && v.tipoVoto === 'downvote').length;
        const totalVotos = upvotes - downvotes;

        const meuVoto = avaliacoes.find(v => v.postagemId.toString() === post.id.toString() && v.usuarioId.toString() === USUARIO_LOGADO_ID.toString());
        const tipoMeuVoto = meuVoto ? meuVoto.tipoVoto : null;

        const classUpvote = tipoMeuVoto === 'upvote' ? 'vote-btn upvote-ativo' : 'vote-btn';
        const classDownvote = tipoMeuVoto === 'downvote' ? 'vote-btn downvote-ativo' : 'vote-btn';

        const card = document.createElement('article');
        card.className = 'relato-card';
        card.innerHTML = `
            <div class="relato-inner">
                <h2 class="relato-title">${post.titulo}</h2>
                <p class="relato-author">Por ${post.anonimo ? 'Anônimo' : 'Usuária'}</p>
                <p class="relato-text">${post.conteudo}</p>
                
                <div class="relato-actions">
                    <div class="vote-pill">
                        <button class="${classUpvote}" onclick="gerenciarVoto('${post.id}', 'upvote')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="18 15 12 9 6 15"></polyline>
                            </svg>
                        </button>
                        <span class="vote-count">${totalVotos}</span>
                        <button class="${classDownvote}" onclick="gerenciarVoto('${post.id}', 'downvote')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        feed.appendChild(card);
    });
}

async function gerenciarVoto(postId, tipo) {
    const res = await fetch(API_VOTOS);
    const todasAvaliacoes = await res.json();

    const votosExistentes = todasAvaliacoes.filter(v => 
        v.postagemId.toString() === postId.toString() && 
        v.usuarioId.toString() === USUARIO_LOGADO_ID.toString()
    );

    if (votosExistentes.length > 0) {
        const votoAtual = votosExistentes[0];

        if (votoAtual.tipoVoto === tipo) {
            await fetch(`${API_VOTOS}/${votoAtual.id}`, { method: 'DELETE' });
        } else {
            await fetch(`${API_VOTOS}/${votoAtual.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tipoVoto: tipo })
            });
        }

        if (votosExistentes.length > 1) {
            for (let i = 1; i < votosExistentes.length; i++) {
                await fetch(`${API_VOTOS}/${votosExistentes[i].id}`, { method: 'DELETE' });
            }
        }

    } else {
        const novoVoto = {
            postagemId: postId.toString(),
            usuarioId: USUARIO_LOGADO_ID,
            tipoVoto: tipo,
            dataCriacao: new Date().toISOString().split('T')[0]
        };
        await fetch(API_VOTOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoVoto)
        });
    }

    carregarDados(); 
}

document.getElementById('formRelato').onsubmit = (e) => {
    e.preventDefault();
    alert("A criação de postagens é responsabilidade de outro módulo.");
};