const currentPage = window.location.pathname.split('/').pop() || 'index.html';

console.log(innerWidth);

document.querySelectorAll('.Navlist a').forEach((link) => {
    const linkPage = link.getAttribute('href');

    if (linkPage === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
    } else {
        link.removeAttribute('aria-current');
    }
});

function navigateWithTransition(url) {
    const targetPage = url.split('/').pop().split('#')[0] || 'index.html';
    const current = window.location.pathname.split('/').pop().split('#')[0] || 'index.html';

    if (targetPage === current && !url.includes('#')) {
        return;
    }

    document.body.classList.add('fade-out');
    setTimeout(() => {
        window.location.href = url;
    }, 200);
}

document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        if (
            !href ||
            href === '#' ||
            href.startsWith('#') ||
            href.startsWith('javascript:') ||
            link.target === '_blank' ||
            href.startsWith('http://') ||
            href.startsWith('https://')
        ) {
            return;
        }

        e.preventDefault();
        navigateWithTransition(href);
    });

    link.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            const href = link.getAttribute('href');
            if (
                href &&
                href !== '#' &&
                !href.startsWith('#') &&
                !href.startsWith('javascript:') &&
                link.target !== '_blank' &&
                !href.startsWith('http://') &&
                !href.startsWith('https://')
            ) {
                e.preventDefault();
                navigateWithTransition(href);
            }
        }
    });
});

window.addEventListener('pageshow', () => {
    document.body.classList.remove('fade-out');
});