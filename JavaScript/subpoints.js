document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".content-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      toggle.parentElement.classList.toggle("open");
    });
  });
});

const saasBtn = document.getElementById("saas");
if (saasBtn) {
  saasBtn.addEventListener("click", () => {
    const parent = saasBtn.parentElement;
    if (parent.querySelector(".extra-saas")) return;

    const div = document.createElement("div");
    div.className = "extra-saas";
    div.innerHTML = `
      <br>
      <a href="https://www.wix.com/ecommerce" target="_blank">Wix eCommerce</a>,
      <a href="https://www.squarespace.com/ecommerce" target="_blank">Squarespace Commerce</a>,<br>
      <a href="https://www.salesforce.com/commerce/" target="_blank">Salesforce Commerce Cloud</a>,
      <a href="https://www.sap.com/products/crm/commerce-cloud.html" target="_blank">SAP Commerce Cloud</a>,<br>
      <a href="https://www.ecwid.com" target="_blank">Ecwid</a>,
      <a href="https://www.lightspeedhq.com/ecommerce" target="_blank">Lightspeed eCommerce</a>,
      <a href="https://www.volusion.com" target="_blank">Volusion</a>,
      <a href="https://www.shopline.com" target="_blank">Shopline</a>
    `;
    parent.appendChild(div);
  });
}

const paasBtn = document.getElementById("paas");
if (paasBtn) {
  paasBtn.addEventListener("click", () => {
    const parent = paasBtn.parentElement;
    if (parent.querySelector(".extra-paas")) return;

    const div = document.createElement("div");
    div.className = "extra-paas";
    div.innerHTML = `
      <br>
      <a href="https://aws.amazon.com/elasticbeanstalk/" target="_blank">
        AWS Elastic Beanstalk
      </a>,
      <a href="https://cloud.google.com/run" target="_blank">
        Google Cloud Run
      </a>
    `;
    parent.appendChild(div);
  });
}

const iaasBtn = document.getElementById("iaas");
if (iaasBtn) {
  iaasBtn.addEventListener("click", () => {
    const parent = iaasBtn.parentElement;
    if (parent.querySelector(".extra-iaas")) return;

    const div = document.createElement("div");
    div.className = "extra-iaas";
    div.innerHTML = `
      <br>
      <a href="https://cloud.google.com/compute" target="_blank">
        Google Compute Engine
      </a>,
      <a href="https://www.digitalocean.com" target="_blank">
        DigitalOcean
      </a>
    `;
    parent.appendChild(div);
  });
}