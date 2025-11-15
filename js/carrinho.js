let carrinho = JSON.parse(localStorage.getItem('carrinhoGameMania')) || [];

function adicionarAoCarrinho(produto) {
    const produtoExistente = carrinho.find(item => item.id === produto.id);
    
    if (!produtoExistente) {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
        localStorage.setItem('carrinhoGameMania', JSON.stringify(carrinho));
        atualizarCarrinho();
        alert('Produto adicionado ao carrinho!');
    }
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    localStorage.setItem('carrinhoGameMania', JSON.stringify(carrinho));
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const containerProdutos = document.querySelector('.container-produtos');
    const precoTotal = document.querySelector('.preco-total');
    
    if (!containerProdutos) return;
    containerProdutos.innerHTML = '';
    
    if (carrinho.length === 0) {
        containerProdutos.innerHTML = `
            <div style="width: 100%; text-align: center; padding: 40px; color: #666; justify-content:center; position:absolute; left: -1%">
                <img src="image/grocery-store.png" alt="Carrinho vazio" style="width: 100px; opacity: 0.5; background-color: gray; padding: 10px;">
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione produtos para continuar</p>
            </div>
        `;
        precoTotal.innerHTML = '';
        return;
    }
    let subtotal = 0;

    carrinho.forEach(produto => {
        const produtoTotal = produto.preco * produto.quantidade;
        subtotal += produtoTotal;
        
        const produtoHTML = `
            <div class="produto-card">
                <div class="produto-imagem">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                </div>
                <div class="produto-info">
                    <h3 class="produto-titulo">${produto.nome}</h3>
                    <div class="produto-precos">
                        <span class="preco-antigo">${produto.precoAntigo || ''}</span>
                        <span class="preco-atual">R$ ${produto.preco.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                    </div>
                    <button class="botao-remover" data-id="${produto.id}">REMOVER</button>
                </div>
            </div>
        `;
        
        containerProdutos.innerHTML += produtoHTML;
    });
    
    const total = subtotal;
    
    precoTotal.innerHTML = `
        <div style="padding: 20px;">
            <h2 style="margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Resumo do Pedido</h2>
    
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 25px; padding-top: 10px; margin-top: 10px;">
                <span>Total:</span>
                <span>R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
            </div>
            <button class="botao-finalizar" style="background-color: green; border: none; border-radius: 8px; padding: 12px; width: 100%; font-weight: bold; margin-top: 20px; cursor: pointer; font-size: 22px">
                Finalizar Compra
            </button>
        </div>
    `;
    
    document.querySelectorAll('.botao-remover').forEach(botao => {
        botao.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            removerDoCarrinho(id);
        });
    });
    
    document.querySelector('.botao-finalizar')?.addEventListener('click', () => {
        alert('Compra finalizada com sucesso!');
        carrinho = [];
        localStorage.setItem('carrinhoGameMania', JSON.stringify(carrinho));
        atualizarCarrinho();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('carrinho.html')) {
        atualizarCarrinho();
        return;
    }

    document.querySelectorAll('.botao-comprar').forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault();
            
            const produtoCard = this.closest('.produto-card');
            const produto = {
                id: produtoCard.querySelector('.produto-titulo').textContent.replace(/\s+/g, '-').toLowerCase(),
                nome: produtoCard.querySelector('.produto-titulo').textContent,
                imagem: produtoCard.querySelector('.produto-imagem img').src,
                preco: parseFloat(produtoCard.querySelector('.preco-atual').textContent.replace('R$ ', '').replace('.', '').replace(',', '.')),
                precoAntigo: produtoCard.querySelector('.preco-antigo')?.textContent || ''
            };
            
            adicionarAoCarrinho(produto);
        });
    });
});

const style = document.createElement('style');
style.textContent = `
    .quantidade-controle {
        margin: 10px 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .quantidade-select {
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #ddd;
    }
    
    .botao-remover {
        background-color: #ff4444;
        color: white;
        border: none;
        border-radius: 25px;
        padding: 12px 30px;
        font-size: 16px;
        font-weight: bold;
        width: 100%;
        cursor: pointer;
        margin-top: 10px;
    }
    
    .botao-remover:hover {
        background-color: #cc0000;
    }
`;
document.head.appendChild(style);