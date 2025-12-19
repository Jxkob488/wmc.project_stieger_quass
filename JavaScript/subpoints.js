document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".content-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      toggle.parentElement.classList.toggle("open");
    });
  });
});

const seeMore = document.getElementById("specialB");
let alreadyDone = true;

seeMore.addEventListener("click", () => {
  const parent = seeMore.parentElement;
  const extend = document.createElement("div");
  extend.classList.add("extra-content");

  if (alreadyDone) {
    extend.innerHTML = `
        <p>
        Additional platforms include:
        <a href="https://www.woocommerce.com" target="_blank">WooCommerce</a>,
        <a href="https://www.shopware.com" target="_blank">Shopware</a>
        </p>
        `;

    parent.appendChild(extend);
    alreadyDone = false;
  }
});
