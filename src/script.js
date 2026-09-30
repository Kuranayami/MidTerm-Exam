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