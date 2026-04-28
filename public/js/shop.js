// Import der Produkte und der Lade-Funktion aus products.js
import { products, loadProducts } from './products.js';

// Globaler Warenkorb-Array, der die ausgewählten Produkte speichert
const cart = [];

// Warten, bis das DOM geladen ist, dann Produkte laden und UI initialisieren
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    displayCart();
    displayProducts();
    setupCheckoutForm();
});

// Zeigt alle Produkte in der Produktliste an
function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-card';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p class="price">€${product.price}</p>
            <p class="category">${product.category}</p>
            <p class="description">${product.description}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;

        const button = productDiv.querySelector('.add-to-cart');
        button.addEventListener('click', () => addToCart(product.id));

        productList.appendChild(productDiv);
    });
}

// Fügt ein Produkt zum Warenkorb hinzu oder erhöht die Menge
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

// Entfernt ein Produkt komplett aus dem Warenkorb
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index >= 0) {
        cart.splice(index, 1);
        displayCart();
    }
}

// Erhöht die Menge eines Produkts im Warenkorb
function increaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
        displayCart();
    }
}

// Verringert die Menge eines Produkts im Warenkorb
function decreaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity -= 1;
        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
        } else {
            displayCart();
        }
    }
}

// Leert den gesamten Warenkorb
function clearCart() {
    cart.length = 0;
    displayCart();
}

// Rendert den Warenkorb-Bereich neu und zeigt alle Items, Gesamtpreis und Buttons
function displayCart() {
    const cartSection = document.getElementById('cart');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartSection.innerHTML = `
        <h2>Shopping Cart</h2>
        ${cart.length === 0 ? '<p>Your cart is empty.</p>' : ''}
        <ul class="cart-items">
            ${cart.map(item => `
                <li>
                    ${item.name} - €${item.price.toFixed(2)}
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    <button class="cart-remove" data-id="${item.id}">Remove</button>
                </li>
            `).join('')}
        </ul>
        <p class="cart-total">Total: €${total.toFixed(2)}</p>
        ${cart.length > 0 ? '<button id="checkout-btn">Checkout</button>' : ''}
        ${cart.length > 0 ? '<button id="clear-cart">Clear Cart</button>' : ''}
    `;

    // Event-Listener für Mengen-Buttons hinzufügen
    cartSection.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', () => {
            const id = Number(button.dataset.id);
            const action = button.dataset.action;
            if (action === 'increase') {
                increaseQuantity(id);
            } else if (action === 'decrease') {
                decreaseQuantity(id);
            }
        });
    });

    // Event-Listener für Entfernen-Buttons hinzufügen
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

    const checkoutButton = document.getElementById('checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', showCheckoutForm);
    }
}

// Richtet die Event-Listener für das Checkout-Formular ein
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    const customerForm = document.getElementById('customer-form');
    const cancelButton = document.getElementById('cancel-order');

    // Formular-Submit-Event
    customerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitCustomerData();
    });

    // Abbrechen-Button
    cancelButton.addEventListener('click', hideCheckoutForm);
}

// Zeigt das Checkout-Formular an
function showCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.classList.add('show');
    checkoutForm.scrollIntoView({ behavior: 'smooth' });
}

// Versteckt das Checkout-Formular und resettet es
function hideCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.classList.remove('show');
    document.getElementById('customer-form').reset();
    clearErrorMessages();
}

// Versteckt alle Fehlermeldungen im Formular
function clearErrorMessages() {
    document.getElementById('name-error').classList.remove('show');
    document.getElementById('email-error').classList.remove('show');
}

// Sendet die Kundendaten an den Server und verarbeitet die Bestellung
async function submitCustomerData() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // Vorherige Fehler löschen
    clearErrorMessages();

    // Validierung der Eingaben
    let hasError = false;

    if (!name) {
        document.getElementById('name-error').textContent = 'Name is required';
        document.getElementById('name-error').classList.add('show');
        hasError = true;
    }

    if (!email) {
        document.getElementById('email-error').textContent = 'Email is required';
        document.getElementById('email-error').classList.add('show');
        hasError = true;
    } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        document.getElementById('email-error').textContent = 'Invalid email address';
        document.getElementById('email-error').classList.add('show');
        hasError = true;
    }

    if (hasError) return;

    try {
        const response = await fetch('/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                address,
                phone
            })
        });

        const data = await response.json();

        if (response.ok) {
            
            hideCheckoutForm();
            showSuccessMessage();
            clearCart();
            document.getElementById('customer-form').reset();
        } else {

            if (data.error === 'Diese E-Mail existiert bereits') {
                document.getElementById('email-error').textContent = 'This email already exists';
                document.getElementById('email-error').classList.add('show');
            } else {
                alert('Error: ' + (data.error || 'Unknown error'));
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting order: ' + error.message);
    }
}

function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    successMessage.classList.add('show');

    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
}