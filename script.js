const nav = document.getElementById('mainNav');
const navToggle = document.getElementById('navToggle');
const header = document.querySelector('.site-header');

function closeNav() {
    nav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
});

nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeNav();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
});

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
});

document.getElementById('year').textContent = new Date().getFullYear();
