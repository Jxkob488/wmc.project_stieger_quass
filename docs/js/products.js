export let products = [];

export async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) {
      throw new Error("Fehler beim Laden der Produkte");
    }
    products = await response.json();
    return products;
  } catch (error) {
    console.error("Fehler:", error);
    return [];
  }
}
