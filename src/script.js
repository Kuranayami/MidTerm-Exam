const THEME_KEY = 'newsdaily-theme';

function getStoredTheme() {
    try {
        return localStorage.getItem(THEME_KEY);
    } catch {
        return null;
    }
}

function resolveTheme() {
    const stored = getStoredTheme();

    if (stored === 'dark' || stored === 'light') {
        return stored;
    }

    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch {
    }

    document.querySelectorAll('.theme-toggle').forEach((btn) => {
        const isDark = theme === 'dark';
        btn.textContent = isDark ? '\u2600' : '\u263E';
        btn.setAttribute('aria-pressed', String(isDark));
        btn.setAttribute(
            'aria-label',
            isDark ? 'Switch to light mode' : 'Switch to dark mode'
        );
        btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    });
}

document.documentElement.setAttribute('data-theme', resolveTheme());

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') || 'light');

    document.querySelectorAll('.theme-toggle').forEach((btn) => {
        btn.addEventListener('click', () => {
            const next =
                document.documentElement.getAttribute('data-theme') === 'dark'
                    ? 'light'
                    : 'dark';
            applyTheme(next);
        });
    });
});

function normalizePath(pathname) {
    let path = (pathname || '').replace(/\\/g, '/');
    if (path.endsWith('/')) {
        path += 'index.html';
    }
    return path;
}

const currentPath = normalizePath(window.location.pathname);

const currentPage = (() => {
    const file = currentPath.split('/').pop() || 'index.html';
    const dir = currentPath.replace(/\/[^/]*$/, '');
    return { file, dir };
})();

document.querySelectorAll('.Navlist a').forEach((link) => {
    const href = link.getAttribute('href');

    if (!href || href === '#' || href.startsWith('#')) {
        link.removeAttribute('aria-current');
        return;
    }

    try {
        const linkUrl = new URL(href, window.location.href);
        const linkPath = normalizePath(linkUrl.pathname);
        const isCurrent = linkPath === currentPath;
        const isSectionParent = linkPath.endsWith('/Activity/')
            || currentPage.dir.endsWith('/Activity');

        if (isCurrent || isSectionParent) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    } catch {
        link.removeAttribute('aria-current');
    }
});

function navigateWithTransition(url) {
    try {
        const targetUrl = new URL(url, window.location.href);
        const currentUrl = new URL(window.location.href);

        const targetPath = normalizePath(targetUrl.pathname);
        const normCurrentPath = normalizePath(currentUrl.pathname);

        if (targetPath === normCurrentPath && targetUrl.search === currentUrl.search && !targetUrl.hash) {
            return;
        }
    } catch {
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