let cart = JSON.parse(localStorage.getItem('checkoutCart') || '[]');
// Fallback: if checkoutCart is empty, try a generic 'cart' key used elsewhere
if (!cart || cart.length === 0) {
    const alt = JSON.parse(localStorage.getItem('cart') || '[]');
    if (alt && alt.length > 0) cart = alt;
}

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

async function handleCheckoutSubmit(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const email = document.getElementById('email').value.trim();

    clearErrorMessages();

    if (!validateCustomerEmail(email)) {
        return;
    }

    // send cart and email to backend to send the email
    try {
        const resp = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, cart })
        });

            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error || 'Server error');

            const msg = document.getElementById('success-message');
            msg.innerHTML = `<p>E-Mail an <strong>${escapeHtml(email)}</strong> gesendet.</p>`;
            if (data.previewUrl) {
                const link = document.createElement('a');
                link.href = data.previewUrl;
                link.target = '_blank';
                link.textContent = 'Vorschau der Test-E‑Mail öffnen';
                msg.appendChild(link);
            }
            msg.classList.add('show');
            localStorage.removeItem('checkoutCart');
    } catch (err) {
        const msg = document.getElementById('success-message');
        msg.innerHTML = `<p style="color:#900">Fehler beim Senden der E‑Mail: ${escapeHtml(err.message)}</p>`;
        msg.classList.add('show');
        console.error('Send error', err);
    }
}

function validateCustomerEmail(email) {
    if (!email) {
        showError('email-error', 'Email is required');
        return false;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showError('email-error', 'Invalid email address');
        return false;
    }
    return true;
}

// no client-side mailto anymore; server sends the email

function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function showError(id, message) {
    const element = document.getElementById(id);
    element.textContent = message;
    element.classList.add('show');
}

function clearErrorMessages() {
    const nameErr = document.getElementById('name-error');
    if (nameErr) nameErr.classList.remove('show');
    const emailErr = document.getElementById('email-error');
    if (emailErr) emailErr.classList.remove('show');
}

function showSuccessMessage() {
    const msg = document.getElementById('success-message');
    if (msg) msg.classList.add('show');
}