(function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  var header = document.querySelector('.site-header');

  function closeNav() {
    nav.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('nav-open', isOpen);
  });

  // close the menu after picking a link on mobile
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
  });

  // if the window gets resized back to desktop while the menu is open
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && nav.classList.contains('open')) closeNav();
  });

  // small shadow under the header once you scroll a bit
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
