// ======= NAV + LANG : accessibilité + UX, en gardant checkbox/label =======

const navToggle = document.getElementById('nav-toggle');
const navLabel = document.querySelector('label[for="nav-toggle"]');

const langToggle = document.getElementById('lang-toggle');
const langLabel = document.querySelector('label[for="lang-toggle"]');

const mqDesktop = window.matchMedia("(min-width: 901px)");

function syncAria() {
    navLabel.setAttribute('aria-expanded', String(navToggle.checked));
    langLabel.setAttribute('aria-expanded', String(langToggle.checked));

    // Texte sr-only pour le bouton menu
    const navSr = navLabel.querySelector('.sr-only');
    if (navSr) navSr.textContent = navToggle.checked ? 'Fermer le menu' : 'Ouvrir le menu';
}

// Permet Enter / Espace sur les labels (clavier)
function labelKeyboardToggle(label, checkbox) {
    label.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
}

labelKeyboardToggle(navLabel, navToggle);
labelKeyboardToggle(langLabel, langToggle);

// Burger change : si on ouvre la nav, on ferme la langue
navToggle.addEventListener('change', () => {
    if (navToggle.checked) langToggle.checked = false;
    syncAria();
});

// Lang change :
// - sur mobile : ne PAS fermer le burger (sinon ça bug car la langue est dans le menu)
// - sur desktop : si tu veux, tu peux fermer le burger (souvent inutile mais safe)
langToggle.addEventListener('change', () => {
    if (langToggle.checked && mqDesktop.matches) {
        navToggle.checked = false;
    }
    syncAria();
});

// Cliquer une langue -> ferme juste le menu langue (utile)
document.querySelectorAll('#lang-menu a').forEach(a => {
    a.addEventListener('click', () => {
        langToggle.checked = false;
        syncAria();
    });
});

// Escape ferme tout
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navToggle.checked = false;
        langToggle.checked = false;
        syncAria();
    }
});

// Click outside -> ferme le menu langue uniquement
document.addEventListener('click', (e) => {
    const insideLang = e.target.closest('.lang-switcher');
    if (!insideLang) {
        langToggle.checked = false;
        syncAria();
    }
});

// Init
syncAria();