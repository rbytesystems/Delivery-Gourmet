// Dados Sincronizados com o Admin
const defaultProducts = [
    {
        id: 1,
        name: "Hambúrguer Clássico",
        desc: "Pão brioche, carne artesanal 150g, queijo cheddar, alface e tomate fresquinho.",
        price: 18.90,
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
    },
    {
        id: 2,
        name: "Batata Especial",
        desc: "Batata frita crocante coberta com cheddar cremoso e cubos de bacon.",
        price: 25.00,
        img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500"
    }
];

let products = JSON.parse(localStorage.getItem('uaitche_db'));

if (!products || products.length === 0) {
    products = defaultProducts;
    // Opcional: Salva os iniciais no storage para que o admin possa editá-los logo de cara
    localStorage.setItem('uaitche_db', JSON.stringify(defaultProducts));
}

let cart = [];

// --- RENDERIZAÇÃO ---
function init() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum produto cadastrado no momento.</p>';
        return;
    }

    products.forEach(p => {
        grid.innerHTML += `
            <div class="card">
                <img src="${p.img}" alt="${p.name}">
                <div class="card-info">
                    <h3>${p.name}</h3>
                    <p>${p.desc}</p>
                    <span class="price-tag">R$ ${parseFloat(p.price).toFixed(2).replace('.', ',')}</span>
                    <button class="btn-buy" onclick="addToCart(${p.id})">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
    });
}

// --- CARRINHO ---
function addToCart(id) {
    const p = products.find(item => item.id === id);
    cart.push(p);
    updateCart();
    // Feedback visual rápido
    const btn = event.target;
    btn.innerHTML = '<i class="fas fa-check"></i> Adicionado';
    setTimeout(() => btn.innerText = 'Adicionar ao Carrinho', 1000);
}

function updateCart() {
    const list = document.getElementById('cart-items-list');
    const count = document.getElementById('cart-count');
    const subtotalEl = document.getElementById('subtotal');
    const finalTotalEl = document.getElementById('final-total');

    // Atualiza a bolinha do ícone do carrinho
    count.innerText = cart.length;

    // CORREÇÃO: Se o carrinho estiver vazio, resetamos os valores visualmente
    if (cart.length === 0) {
        list.innerHTML = '<p class="empty-msg">Seu carrinho está vazio...</p>';
        subtotalEl.innerText = 'R$ 0,00';
        finalTotalEl.innerText = 'R$ 5,00'; // Valor apenas do frete
        return;
    }

    // Renderiza a lista de itens com a miniatura
    list.innerHTML = cart.map((item, index) => `
        <div class="cart-item-row">
            <div class="cart-item-info">
                <img src="${item.img}" class="cart-item-thumb">
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">R$ ${parseFloat(item.price).toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
            <i class="fas fa-times remove-icon" onclick="removeItem(${index})"></i>
        </div>
    `).join('');

    // CORREÇÃO: Cálculo matemático garantindo que o preço seja um número (parseFloat)
    const subtotal = cart.reduce((acc, item) => {
        return acc + parseFloat(item.price);
    }, 0);

    // Atualiza os textos dos valores na tela
    subtotalEl.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    finalTotalEl.innerText = `R$ ${(subtotal + 5).toFixed(2).replace('.', ',')}`;
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// --- CARROSSEL ---
let slideIdx = 0;
function moveSlide(n) {
    const container = document.getElementById('carousel');
    const totalSlides = document.querySelectorAll('.slide').length;
    slideIdx = (slideIdx + n + totalSlides) % totalSlides;
    container.style.transform = `translateX(${-slideIdx * 100}%)`;
}
setInterval(() => moveSlide(1), 5000);

// --- WHATSAPP ---
function checkoutWhatsApp() {
    if (cart.length === 0) return alert("Adicione produtos ao carrinho!");

    const name = document.getElementById('c-name').value;
    const address = document.getElementById('c-address').value;
    if (!name || !address) return alert("Por favor, preencha nome e endereço.");

    const bairro = document.getElementById('c-bairro').value;
    const pagamento = document.getElementById('c-payment').value;
    const total = cart.reduce((acc, item) => acc + item.price, 0) + 5;

    let text = `*NOVO PEDIDO - UAITCHE*%0A%0A`;
    text += `*Cliente:* ${name}%0A`;
    text += `*Entrega:* ${address}, ${bairro}%0A%0A`;
    text += `*Itens:*%0A${cart.map(i => `- ${i.name} (R$ ${i.price.toFixed(2)})`).join('%0A')}%0A%0A`;
    text += `*Pagamento:* ${pagamento}%0A`;
    text += `*Total Final:* R$ ${total.toFixed(2)}`;

    const phone = "5531999999999"; // Troque pelo seu número
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

init();