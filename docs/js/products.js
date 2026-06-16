export let products = [];

// Mock Produkte für GitHub Pages (ohne Backend)
const mockProducts = [
    { id: 1, name: "T-Shirt", price: 19.99, category: "Clothing", description: "Comfortable cotton t-shirt", image: "./images/tshirt.png" },
    { id: 2, name: "Hoodie", price: 49.99, category: "Clothing", description: "Warm and cozy hoodie", image: "./images/hoodie.png" },
    { id: 3, name: "Cap", price: 14.99, category: "Accessories", description: "Classic baseball cap", image: "./images/cap.png" },
    { id: 4, name: "Sneaker", price: 89.99, category: "Shoes", description: "Modern sneaker shoes", image: "./images/sneaker.png" },
    { id: 5, name: "Watch", price: 129.99, category: "Accessories", description: "Elegant watch", image: "./images/watch.jpg" },
    { id: 6, name: "Backpack", price: 59.99, category: "Bags", description: "Durable backpack", image: "./images/backpack.png" }
];

export async function loadProducts() {
  try {
    // Verwende Mock-Daten für GitHub Pages
    products = mockProducts;
    return products;
  } catch (error) {
    console.error("Fehler:", error);
    return [];
  }
}
