const cart = JSON.parse(localStorage.getItem('checkoutCart') || '[]');

document.addEventListener('DOMContentLoaded', () => {
    renderOrderSummary();

    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', handleCheckoutSubmit);
});

function renderOrderSummary() {
    const summary = document.getElementById('order-summary');

    if (cart.length === 0) {
        summary.innerHTML = `
            <p>Your cart is empty.</p>
            <a href="/pages/shop.html" class="secondary-link">Back to Shop</a>
        `;
        return;
    }

    const total = calculateTotal();

    summary.innerHTML = `
        <ul class="cart-items">
            ${cart.map(item => `
                <li>
                    ${item.name} x ${item.quantity}
                    <strong>€${(item.price * item.quantity).toFixed(2)}</strong>
                </li>
            `).join('')}
        </ul>
        <p class="cart-total">Total: €${total.toFixed(2)}</p>
    `;
}

function handleCheckoutSubmit(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();

    clearErrorMessages();

    if (!validateCustomerData(name, email)) {
        return;
    }

    openOrderEmail(name, email, address, phone);
    showSuccessMessage();
    localStorage.removeItem('checkoutCart');
}

function validateCustomerData(name, email) {
    let isValid = true;

    if (!name) {
        showError('name-error', 'Name is required');
        isValid = false;
    }

    if (!email) {
        showError('email-error', 'Email is required');
        isValid = false;
    } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showError('email-error', 'Invalid email address');
        isValid = false;
    }

    return isValid;
}

function openOrderEmail(name, email, address, phone) {
    const total = calculateTotal();
    const orderLines = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        return `- ${item.name} x${item.quantity}: €${itemTotal.toFixed(2)}`;
    }).join('\n');

    const subject = encodeURIComponent('Order confirmation');
    const body = encodeURIComponent(
`Hello ${name},

thank you for your order.

Your order:
${orderLines}

Total: €${total.toFixed(2)}

Shipping address:
${address || '-'}

Phone:
${phone || '-'}

We will process your order soon.`
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function showError(id, message) {
    const element = document.getElementById(id);
    element.textContent = message;
    element.classList.add('show');
}

function clearErrorMessages() {
    document.getElementById('name-error').classList.remove('show');
    document.getElementById('email-error').classList.remove('show');
}

function showSuccessMessage() {
    document.getElementById('success-message').classList.add('show');
}
