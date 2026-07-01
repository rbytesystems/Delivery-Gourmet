// CONFIGURAÇÃO DE SEGURANÇA
const MASTER_PASSWORD = "123"; // Troque para a sua senha
let currentBase64Image = "";

// --- CONTROLE DE ACESSO ---
function checkPassword() {
    const passInput = document.getElementById('admin-password').value;
    if (passInput === MASTER_PASSWORD) {
        sessionStorage.setItem('is_admin', 'true');
        showPanel();
    } else {
        alert("Senha incorreta!");
    }
}

function showPanel() {
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
    renderAdminTable();
}

function logout() {
    sessionStorage.removeItem('is_admin');
    window.location.href = "index.html";
}

// Verifica se já está logado ao carregar
window.onload = () => {
    if (sessionStorage.getItem('is_admin') === 'true') {
        showPanel();
    }
}

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

// --- LÓGICA DE PRODUTOS (CRUD) ---
let products = JSON.parse(localStorage.getItem('uaitche_db'));

if (!products || products.length === 0) {
    products = defaultProducts;
    localStorage.setItem('uaitche_db', JSON.stringify(defaultProducts));
}

function renderAdminTable() {
    const tableBody = document.getElementById('admin-table-body');
    tableBody.innerHTML = '';

    products.forEach(p => {
        tableBody.innerHTML += `
            <tr>
                <td><img src="${p.img}" class="img-preview"></td>
                <td><strong>${p.name}</strong><br><small>${p.desc}</small></td>
                <td>R$ ${parseFloat(p.price).toFixed(2)}</td>
                <td style="text-align: right;">
                    <button class="btn-edit" onclick="prepareEdit(${p.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('img-upload-preview');
    const text = document.getElementById('preview-text');

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            currentBase64Image = e.target.result; // Este é o código da imagem
            preview.src = currentBase64Image;
            preview.style.display = 'block';
            text.style.display = 'none';
        }

        reader.readAsDataURL(file);
    }
}


function saveProduct() {
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('p-name').value;
    const desc = document.getElementById('p-desc').value;
    const price = parseFloat(document.getElementById('p-price').value);

    if (!name || isNaN(price)) return alert("Preencha os campos obrigatórios!");
    if (!currentBase64Image && !id) return alert("Por favor, selecione uma foto!");

    if (id) {
        const index = products.findIndex(p => p.id == id);
        // Se não selecionou imagem nova, mantém a antiga
        const finalImg = currentBase64Image || products[index].img;
        products[index] = { id: parseInt(id), name, desc, price, img: finalImg };
    } else {
        products.push({ id: Date.now(), name, desc, price, img: currentBase64Image });
    }

    localStorage.setItem('uaitche_db', JSON.stringify(products));
    resetForm();
    renderAdminTable();
}


function deleteProduct(id) {
    if (confirm("Deseja excluir este item permanentemente?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('uaitche_db', JSON.stringify(products));
        renderAdminTable();
    }
}

function prepareEdit(id) {
    const p = products.find(p => p.id === id);
    document.getElementById('edit-id').value = p.id;
    document.getElementById('p-name').value = p.name;
    document.getElementById('p-desc').value = p.desc;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-img').value = p.img;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('edit-id').value = '';
    document.getElementById('admin-form').reset();
    document.getElementById('img-upload-preview').style.display = 'none';
    document.getElementById('preview-text').style.display = 'block';
    currentBase64Image = ""; // Limpa a variável
}

