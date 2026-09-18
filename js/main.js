const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function initTicker() {
    const track = document.getElementById('tickerTrack');
    if (!track || reduceMotion.matches) return;

    [...track.children].forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });
    track.classList.add('is-animated');
}

function initStickyNav() {
    const nav = document.getElementById('stickyNav');
    const header = document.querySelector('.site-header');
    if (!nav || !header) return;

    new IntersectionObserver(([entry]) => {
        nav.classList.toggle('is-visible', !entry.isIntersecting);
    }).observe(header);
}

function initMenu() {
    const menu = document.getElementById('siteMenu');
    if (!menu) return;

    const panel = menu.querySelector('.menu__panel');
    const searchInput = menu.querySelector('.menu__search-input');
    const openers = document.querySelectorAll('[data-menu-open]');
    const focusable = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    let lastOpener = null;

    function setOpen(state) {
        menu.classList.toggle('is-open', state);
        document.body.classList.toggle('is-locked', state);
        openers.forEach((btn) => {
            if (btn.hasAttribute('aria-expanded')) btn.setAttribute('aria-expanded', state);
        });
    }

    function open(opener) {
        lastOpener = opener;
        setOpen(true);

        const target = opener.dataset.menuOpen === 'search' && searchInput
            ? searchInput
            : panel.querySelector(focusable);
        target?.focus({ preventScroll: true });
        document.addEventListener('keydown', onKeydown);
    }

    function close() {
        setOpen(false);
        document.removeEventListener('keydown', onKeydown);
        lastOpener?.focus({ preventScroll: true });
    }

    function onKeydown(e) {
        if (e.key === 'Escape') {
            close();
            return;
        }
        if (e.key !== 'Tab') return;

        const items = panel.querySelectorAll(focusable);
        const first = items[0];
        const last = items[items.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    openers.forEach((btn) => btn.addEventListener('click', () => open(btn)));
    menu.querySelectorAll('[data-menu-close]').forEach((el) => el.addEventListener('click', close));
    menu.querySelector('.menu__search')?.addEventListener('submit', (e) => e.preventDefault());
}

function initCarousel(root) {
    const track = root.querySelector('[data-carousel-track]');
    const slides = track ? [...track.querySelectorAll('[data-carousel-slide]')] : [];
    if (!slides.length) return;

    const prevBtn = root.querySelector('[data-carousel-prev]');
    const nextBtn = root.querySelector('[data-carousel-next]');
    const dotsWrap = root.querySelector('[data-carousel-dots]');
    let dots = [];
    let pages = 0;
    let current = 0;
    let ticking = false;

    const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);
    const step = () => (slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth) || 1;

    function scrollToPage(page) {
        page = Math.max(0, Math.min(pages - 1, page));
        track.scrollTo({
            left: Math.min(page * step(), maxScroll()),
            behavior: reduceMotion.matches ? 'auto' : 'smooth'
        });
    }

    function createDot(index) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel__dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `${index + 1} von ${pages}`);
        dot.addEventListener('click', () => scrollToPage(index));
        dot.addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            e.preventDefault();
            const next = (index + (e.key === 'ArrowRight' ? 1 : -1) + pages) % pages;
            scrollToPage(next);
            dots[next].focus();
        });
        return dot;
    }

    function measure() {
        const count = 1 + Math.ceil((maxScroll() - 1) / step());
        if (count === pages) return;

        pages = count;
        if (dotsWrap) {
            dots = Array.from({ length: pages }, (_, i) => createDot(i));
            dotsWrap.replaceChildren(...dots);
        }
    }

    function update() {
        const x = track.scrollLeft;
        current = maxScroll() - x < 1 ? pages - 1 : Math.min(pages - 1, Math.round(x / step()));

        dots.forEach((dot, i) => {
            const active = i === current;
            dot.classList.toggle('is-active', active);
            dot.setAttribute('aria-selected', active);
            dot.tabIndex = active ? 0 : -1;
        });
        if (prevBtn) prevBtn.disabled = current === 0;
        if (nextBtn) nextBtn.disabled = current === pages - 1;
    }

    prevBtn?.addEventListener('click', () => scrollToPage(current - 1));
    nextBtn?.addEventListener('click', () => scrollToPage(current + 1));

    track.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            update();
        });
    }, { passive: true });

    window.addEventListener('resize', () => {
        measure();
        update();
    });
    measure();
    update();
}

initTicker();
initStickyNav();
initMenu();
document.querySelectorAll('[data-carousel]').forEach(initCarousel);
