import { products, loadProducts } from './products.js';

const button = document.getElementById('test');
button.addEventListener('click', async () => {
    await loadProducts();
    console.log(products);
    displayProducts();
});

function displayProducts() {
    const productList = document.createElement('div');
    productList.id = 'product-list';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>Preis: €${product.price}</p>
            <p>Kategorie: ${product.category}</p>
            <p>${product.description}</p>
            <img src="${product.image}" alt="${product.name}" style="width: 100px;">
        `;
        productList.appendChild(productDiv);
    });
    document.body.appendChild(productList);
}