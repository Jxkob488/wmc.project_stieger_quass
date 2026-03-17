import { products } from './products.js';

const button = document.getElementById('test');
button.addEventListener('click', () => {
    console.log(products);
});