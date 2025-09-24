const API_URL = window.location.href + "api/downloadGuides";
const themeToggle = document.getElementById("themeToggle");
const currentTheme = localStorage.getItem("theme") || "light";

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

  const formData = new FormData(contactForm);
  try {
    const res = await fetch("https://cooked-resume.vercel.app/api/contact", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error("Failed to upload file");
    }
    const data = await res.json();
  } catch (error) {
    console.log(error.message);
  }
  alert(data.message);
});

const downloadBtn = document.getElementById("downloadBtn");
downloadBtn.addEventListener("click", () => {
  window.location.href = "https://cooked-resume.vercel.app/api/download-guides";
});
