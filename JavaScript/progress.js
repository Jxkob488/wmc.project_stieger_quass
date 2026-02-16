const currentStep = 3;
const totalSteps = 7;

const progress = (currentStep / totalSteps) * 100;
document.getElementById("guideProgress").style.width = progress + "%";
