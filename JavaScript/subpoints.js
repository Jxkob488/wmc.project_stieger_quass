document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".content-toggle").forEach(toggle => {
        toggle.addEventListener("click", () => {
            toggle.parentElement.classList.toggle("open");
        });
    });
});
