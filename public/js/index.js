const uploadSection = document.getElementById("uploadSection");
const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const loadingSection = document.getElementById("loadingSection");
const resultsSection = document.getElementById("resultsSection");
const errorSection = document.getElementById("errorSection");
const feedbackContainer = document.getElementById("feedbackContainer");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const errorClearBtn = document.getElementById("errorClearBtn");
const themeToggle = document.getElementById("themeToggle");
const errorMessage = document.getElementById("errorMessage");
const errorCode = document.getElementById("errorCode");

const API_URL = window.location.href + "api/review-resume";

function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

function handleFileUpload(file) {
  if (!file) return;

  if (file.type !== "application/pdf") {
    showError({ message: "Please upload a PDF file", status: 400 });
    return;
  }

  submitResume(file);
}

async function submitResume(file) {
  const formData = new FormData();
  formData.append("resume", file);

  uploadSection.classList.add("hidden");
  errorSection.classList.add("hidden");
  resultsSection.classList.add("hidden");
  loadingSection.classList.remove("hidden");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw {
        message: error.message || "Failed to review resume",
        status: response.status,
      };
    }

    console.log("text received");

    const data = await response.json();
    console.log("text formatted");
    showResults(data.output_text);

    console.log("text output");
  } catch (error) {
    showError({
      message: error.message || "An unexpected error occurred",
      status: error.status || 500,
    });
  }
}

function showResults(feedback) {
  feedbackContainer.textContent = feedback;
  loadingSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");
}

function showError(error) {
  errorMessage.textContent = error.message;
  errorCode.textContent = error.status ? `(${error.status})` : "";
  loadingSection.classList.add("hidden");
  errorSection.classList.remove("hidden");
}

function clearAll() {
  uploadSection.classList.remove("hidden");
  loadingSection.classList.add("hidden");
  resultsSection.classList.add("hidden");
  errorSection.classList.add("hidden");
  fileInput.value = "";
  feedbackContainer.textContent = "";
}

async function copyFeedback() {
  const feedback = feedbackContainer.textContent;

  try {
    await navigator.clipboard.writeText(feedback);

    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
        `;
    copyBtn.style.color = "var(--success-color)";

    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.style.color = "";
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}

uploadArea.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  handleFileUpload(file);
});

uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("drag-over");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("drag-over");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("drag-over");

  const file = e.dataTransfer.files[0];
  handleFileUpload(file);
});

copyBtn.addEventListener("click", copyFeedback);
clearBtn.addEventListener("click", clearAll);
errorClearBtn.addEventListener("click", clearAll);
themeToggle.addEventListener("click", toggleTheme);

document.addEventListener("dragover", (e) => {
  e.preventDefault();
});

document.addEventListener("drop", (e) => {
  e.preventDefault();
});

initTheme();
