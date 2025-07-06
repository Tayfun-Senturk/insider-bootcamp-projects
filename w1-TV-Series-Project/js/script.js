const hamburger = document.getElementById("hamburger");
const navbar = document.getElementById("navbar");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navbar.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !navbar.contains(e.target)) {
    hamburger.classList.remove("active");
    navbar.classList.remove("open");
  }
});

const favBtn = document.getElementById("fav-btn");

if (favBtn) {
  favBtn.addEventListener("click", () => {
    favBtn.classList.toggle("active");
    if (favBtn.classList.contains("active")) {
      favBtn.textContent = "❤ Favorilerimde";
    } else {
      favBtn.textContent = "❤ Favorilere Ekle";
    }
  });
} 