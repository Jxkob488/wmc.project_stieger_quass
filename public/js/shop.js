import { products, loadProducts } from './products.js';

const cart = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    displayCart();
    displayProducts();
});

function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear previous

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-card';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p class="price">€${product.price}</p>
            <p class="category">${product.category}</p>
            <p class="description">${product.description}</p>
            <button class="add-to-cart" data-id="${product.id}">In den Warenkorb</button>
        `;

        const button = productDiv.querySelector('.add-to-cart');
        button.addEventListener('click', () => addToCart(product.id));

        productList.appendChild(productDiv);
    });
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    displayCart();
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index >= 0) {
        cart.splice(index, 1);
        displayCart();
    }
}

function clearCart() {
    cart.length = 0;
    displayCart();
}

function displayCart() {
    const cartSection = document.getElementById('cart');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartSection.innerHTML = `
        <h2>Warenkorb</h2>
        ${cart.length === 0 ? '<p>Der Warenkorb ist leer.</p>' : ''}
        <ul class="cart-items">
            ${cart.map(item => `
                <li>
                    ${item.name} x ${item.quantity} - €${(item.price * item.quantity).toFixed(2)}
                    <button class="cart-remove" data-id="${item.id}">Entfernen</button>
                </li>
            `).join('')}
        </ul>
        <p class="cart-total">Gesamt: €${total.toFixed(2)}</p>
        ${cart.length > 0 ? '<button id="clear-cart">Warenkorb leeren</button>' : ''}
    `;

    cartSection.querySelectorAll('.cart-remove').forEach(button => {
        button.addEventListener('click', () => {
            const id = Number(button.dataset.id);
            removeFromCart(id);
        });
    });

    const clearButton = document.getElementById('clear-cart');
    if (clearButton) {
        clearButton.addEventListener('click', clearCart);
    }
}
