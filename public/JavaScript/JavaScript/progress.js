const progressContainer = document.querySelector(".progress");

if (progressContainer) {
    const bar = document.getElementById("guideProgress");
    const currentStep = Number(progressContainer.dataset.step);
    const totalSteps = 7;

    const targetWidth = (currentStep / totalSteps) * 100;

    bar.style.transition = "none";
    bar.style.width = targetWidth + "%";

    requestAnimationFrame(() => {
        bar.style.transition = "width 0.4s ease";
        bar.style.width = targetWidth + "%";
    });
}