let currentPage = 0;
const pages = document.querySelectorAll(".page");
let selectedFood = "",
  selectedMovie = "";
const heartFill = document.getElementById("heartFill");
const heartLeft = document.getElementById("heartLeft");
const heartRight = document.getElementById("heartRight");
const heartContainer = document.getElementById("heartContainer");
const heartTopWrapper = document.getElementById("heartTopWrapper");
const heartResultWrapper = document.getElementById("heartResultWrapper");
const stepIndicator = document.getElementById("stepIndicator");
const validationMessage = document.getElementById("validationMessage");

function updateHeart(percent) {
  const maxHeight = 90;
  heartFill.setAttribute("height", (percent / 100) * maxHeight);
  heartFill.setAttribute("y", maxHeight - (percent / 100) * maxHeight);
}

function updateStepIndicator(textOverride) {
  if (!stepIndicator) return;

  if (textOverride) {
    stepIndicator.textContent = textOverride;
    return;
  }

  if (currentPage <= 5) {
    stepIndicator.textContent = `Step ${currentPage + 1} of 6`;
  } else {
    stepIndicator.textContent = "";
  }
}

function showValidation(message) {
  if (!validationMessage) return;
  validationMessage.textContent = message;
  validationMessage.classList.add("visible");
}

function clearValidation() {
  if (!validationMessage) return;
  validationMessage.textContent = "";
  validationMessage.classList.remove("visible");
}

function nextPage(type) {
  document.body.classList.remove("result-active");
  if (type === "food" && selectedFood === "") {
    showValidation("Pick at least one food to continue.");
    return;
  }
  if (type === "movie" && selectedMovie === "") {
    showValidation("Pick a movie for our date.");
    return;
  }
  clearValidation();
  pages[currentPage].classList.remove("active");
  currentPage++;
  pages[currentPage].classList.add("active");

  if (currentPage === 1) {
    updateHeart(15);
  } else if (currentPage === 2) {
    updateHeart(30);
  } else if (currentPage === 3) {
    updateHeart(40);
  } else if (currentPage === 4) {
    updateHeart(50);
  } else if (currentPage === 5) {
    updateHeart(60);
  }
  updateStepIndicator();
}

document.querySelectorAll(".option").forEach((option) => {
  option.addEventListener("click", () => {
    document
      .querySelectorAll(".option")
      .forEach((o) => o.classList.remove("selected"));
    option.classList.add("selected");
    selectedFood = option.dataset.food;
    clearValidation();
  });
});

document.querySelectorAll(".movie-list li").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".movie-list li")
      .forEach((i) => i.classList.remove("selected"));
    item.classList.add("selected");
    selectedMovie = item.textContent;
    clearValidation();
  });
});

function showResult() {
  if (selectedFood === "" || selectedMovie === "") {
    showValidation("First choose our food and movie on the earlier steps.");
    return;
  }
  pages[currentPage].classList.remove("active");
  document.getElementById("resultPage").classList.add("active");

  document.body.classList.add("result-active");
  // Keep the heart SVG in the top wrapper; do not move it into the result page.
  updateHeart(100);
  document.getElementById("resultText").innerHTML = `
        🍽 <strong>${selectedFood}</strong><br/>
        🎬 <strong>${selectedMovie}</strong>
    `;
  confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
  updateStepIndicator("All set 💘");
}

function moveNo(button) {
  button.style.position = "absolute";
  button.style.left = Math.random() * 80 + "%";
  button.style.top = Math.random() * 80 + "%";
}

function endProcess() {
  document.body.classList.remove("result-active");
  pages.forEach((p) => p.classList.remove("active"));
  document.getElementById("sadPage").classList.add("active");

  let percent = (parseInt(heartFill.getAttribute("height")) / 90) * 100;
  let drain = setInterval(() => {
    percent -= 5;
    if (percent <= 0) {
      percent = 0;
      clearInterval(drain);
      triggerBreak();
    }
    updateHeart(percent);
  }, 50);
  updateStepIndicator("Story ended 💔");
}

function triggerBreak() {
  heartLeft.classList.remove("hidden");
  heartRight.classList.remove("hidden");
  heartLeft.classList.add("heart-break-left");
  heartRight.classList.add("heart-break-right");
  document.getElementById("heartOutline").classList.add("hidden");
  heartFill.classList.add("hidden");
}

updateHeart(0);
updateStepIndicator();
