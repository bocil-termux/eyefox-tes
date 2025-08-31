// global helper so inline onclick="toggleMenu()" works
window.toggleMenu = function () {
  const menu = document.getElementById("dropdownMenu");
  const btn = document.querySelector(".dropbtn");
  if (!menu) return;
  menu.classList.toggle("show");
  const isOpen = menu.classList.contains("show");
  btn.setAttribute("aria-expanded", String(isOpen));
  menu.setAttribute("aria-hidden", String(!isOpen));
};

// make goPage available globally
window.goPage = function (page) {
  window.location.href = page;
};

document.addEventListener("DOMContentLoaded", () => {
  const dropdownMenu = document.getElementById("dropdownMenu");
  const dropdownBtn = document.querySelector(".dropbtn");
  const toggleBtn = document.getElementById("toggleMode");
  const mainTitle = document.getElementById("mainTitle");

  // Ensure About link points correctly (in case HTML had '#')
  if (dropdownMenu) {
    const anchors = dropdownMenu.querySelectorAll("a");
    anchors.forEach(a => {
      const t = (a.textContent || "").trim().toLowerCase();
      if (t === "about") a.href = "about.html";
      if (t.includes("report")) a.href = "mailto:yarunban@gmail.com";
      // FAQ is left as 'faq.html' in HTML already
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", (ev) => {
    if (!dropdownMenu) return;
    if (!dropdownMenu.contains(ev.target) && !dropdownBtn.contains(ev.target)) {
      dropdownMenu.classList.remove("show");
      dropdownBtn.setAttribute("aria-expanded", "false");
      dropdownMenu.setAttribute("aria-hidden", "true");
    }
  });

  // Close with ESC
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      if (dropdownMenu) {
        dropdownMenu.classList.remove("show");
        dropdownBtn.setAttribute("aria-expanded", "false");
        dropdownMenu.setAttribute("aria-hidden", "true");
      }
    }
  });

  // Theme toggle (persist in localStorage)
  function setMode(mode) {
    document.body.classList.remove("dark-mode", "light-mode");
    document.body.classList.add(mode);
    toggleBtn.textContent = mode === "dark-mode" ? "🌙" : "☀️";
    localStorage.setItem("theme", mode);
  }

  // initialise theme
  const saved = localStorage.getItem("theme");
  if (saved === "light-mode" || saved === "dark-mode") {
    setMode(saved);
  } else {
    // default remains dark-mode (per your HTML)
    setMode(document.body.classList.contains("light-mode") ? "light-mode" : "dark-mode");
  }

  toggleBtn.addEventListener("click", () => {
    const newMode = document.body.classList.contains("dark-mode") ? "light-mode" : "dark-mode";
    setMode(newMode);
    // optional: color adjustment for title handled by CSS; no inline style needed
  });

  // Simple slideshow
  let slideIndex = 0;
  function showSlides() {
    const slides = document.getElementsByClassName("slides");
    if (!slides || slides.length === 0) return;
    for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 4000);
  }
  showSlides();
});