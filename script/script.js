const slides = document.querySelectorAll('.hero-slide');
let current = 0;
const intervalTime = 2700; // troca a cada 5 segundos

setInterval(() => {
  slides[current].classList.remove('active');
  current = (current + 1) % slides.length;
  slides[current].classList.add('active');
}, intervalTime);

const navbar = document.querySelector('.navbar');
const heroHeight = document.querySelector('.hero').offsetHeight;

window.addEventListener('scroll', () => {
  if (window.scrollY > heroHeight - 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});