import { products, loadProducts } from './products.js';

document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
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
        `;
        productList.appendChild(productDiv);
    });
}