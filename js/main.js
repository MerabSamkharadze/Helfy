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
    const searchForm = menu.querySelector('.menu__search');
    const openers = document.querySelectorAll('[data-menu-open]');
    const focusable = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    let lastOpener = null;

    function setExpanded(state) {
        openers.forEach((btn) => {
            if (btn.hasAttribute('aria-expanded')) btn.setAttribute('aria-expanded', state);
        });
    }

    function open(opener) {
        lastOpener = opener;
        menu.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        setExpanded(true);

        const target = opener.dataset.menuOpen === 'search' && searchInput
            ? searchInput
            : panel.querySelector(focusable);
        if (target) target.focus({ preventScroll: true });
        document.addEventListener('keydown', onKeydown);
    }

    function close() {
        menu.classList.remove('is-open');
        document.body.style.overflow = '';
        setExpanded(false);
        document.removeEventListener('keydown', onKeydown);
        if (lastOpener) lastOpener.focus({ preventScroll: true });
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
    if (searchForm) searchForm.addEventListener('submit', (e) => e.preventDefault());
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
    // distance between two neighbouring slides (slide width + gap)
    const step = () => (slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth) || 1;
    // one dot per reachable scroll position (depends on how many slides fit in the viewport)
    const pageCount = () => 1 + Math.ceil(maxScroll() / step() - 0.05);

    function scrollToPage(page) {
        page = Math.max(0, Math.min(pages - 1, page));
        track.scrollTo({
            left: Math.min(page * step(), maxScroll()),
            behavior: reduceMotion.matches ? 'auto' : 'smooth'
        });
    }

    function currentPage() {
        if (maxScroll() - track.scrollLeft < 1) return pages - 1;
        return Math.max(0, Math.min(pages - 1, Math.round(track.scrollLeft / step())));
    }

    function buildDots() {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = '';
        dots = [];

        for (let i = 0; i < pages; i += 1) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel__dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `${i + 1} von ${pages}`);
            dot.addEventListener('click', () => scrollToPage(i));
            dot.addEventListener('keydown', (e) => {
                if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                e.preventDefault();
                const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + pages) % pages;
                scrollToPage(next);
                dots[next].focus();
            });
            dotsWrap.appendChild(dot);
            dots.push(dot);
        }
    }

    function update() {
        const count = pageCount();
        if (count !== pages) {
            pages = count;
            buildDots();
        }
        current = currentPage();
        const scrollable = maxScroll() > 1;

        dots.forEach((dot, i) => {
            const active = i === current;
            dot.classList.toggle('is-active', active);
            dot.setAttribute('aria-selected', active);
            dot.tabIndex = active ? 0 : -1;
        });
        if (prevBtn) prevBtn.disabled = !scrollable || current === 0;
        if (nextBtn) nextBtn.disabled = !scrollable || current === pages - 1;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => scrollToPage(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => scrollToPage(current + 1));

    track.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            update();
        });
    }, { passive: true });

    window.addEventListener('resize', update);
    update();
}

initTicker();
initStickyNav();
initMenu();
document.querySelectorAll('[data-carousel]').forEach(initCarousel);
