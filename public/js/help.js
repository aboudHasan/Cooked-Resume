const downloadAPI = window.location.origin + "/api/download-guides";
const contactAPI = window.location.origin + "/api/contact";
const themeToggle = document.getElementById("themeToggle");
const currentTheme = localStorage.getItem("theme") || "light";
const submitButton = document.querySelector("#submit-button");

document.documentElement.setAttribute("data-theme", currentTheme);

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

const fileUploadArea = document.getElementById("fileUploadArea");
const pdfUpload = document.getElementById("pdfUpload");
const fileUploadText = fileUploadArea.querySelector(".file-upload-text");

fileUploadArea.addEventListener("click", () => {
  pdfUpload.click();
});

pdfUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    fileUploadText.textContent = `Selected: ${file.name}`;
  }
});

fileUploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  fileUploadArea.classList.add("drag-over");
});

fileUploadArea.addEventListener("dragleave", (e) => {
  e.preventDefault();
  fileUploadArea.classList.remove("drag-over");
});

fileUploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  fileUploadArea.classList.remove("drag-over");

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type === "application/pdf") {
      pdfUpload.files = files;
      fileUploadText.textContent = `Selected: ${file.name}`;
    } else {
      alert("Please upload a PDF file only.");
    }
  }
});

const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitButton.classList.remove("btn-primary");
  submitButton.classList.add("btn-secondary");
  setTimeout(() => {
    submitButton.classList.remove("btn-secondary");
    submitButton.classList.add("btn-primary");
  }, 1000);

  const formData = new FormData(contactForm);
  try {
    const res = await fetch(contactAPI, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(data.message);
  } catch (error) {
    alert(error.message);
  }
});

const downloadBtn = document.getElementById("downloadBtn");
downloadBtn.addEventListener("click", () => {
  window.location.href = downloadAPI;
});
