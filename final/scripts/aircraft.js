/**
 * main.js
 * This file contains global JavaScript logic used across all pages of the application,
 * primarily for handling the theme toggle and mobile navigation.
 */

// --- Global DOM Selectors ---
const mainDOMElements = {
    themeToggle: document.getElementById('themeToggle'),
    mobileMenuToggle: document.querySelector('.menu-toggle'),
    mainNav: document.querySelector('.main-nav'),
    currentYearSpan: document.getElementById('currentYear')
};

// --- Theme Management ---

const THEME_KEY = 'aviationTrackerTheme';
const PREFERRED_DARK = '(prefers-color-scheme: dark)';

/**
 * Sets the theme class on the document element and saves the preference to localStorage.
 * @param {string} theme - 'light' or 'dark'.
 */
const setTheme = (theme) => {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // Update button text/icon for accessibility and clarity
    if (mainDOMElements.themeToggle) {
        mainDOMElements.themeToggle.innerHTML = isDark
            ? '🌙 Dark Mode'
            : '☀️ Light Mode';
        mainDOMElements.themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    }
};

/**
 * Toggles the theme between light and dark.
 */
const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
};

/**
 * Initializes the theme based on local storage or system preference.
 */
const initializeTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);

    // 1. Check for saved preference
    if (savedTheme) {
        setTheme(savedTheme);
    }
    // 2. Check for system preference if no saved theme exists
    else if (window.matchMedia(PREFERRED_DARK).matches) {
        setTheme('dark');
    }
    // 3. Default to light
    else {
        setTheme('light');
    }

    // Add listener for changes in system preference *after* initial load
    window.matchMedia(PREFERRED_DARK).addEventListener('change', (e) => {
        // Only update if no explicit user preference is set in localStorage
        if (!localStorage.getItem(THEME_KEY)) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Attach click listener to the toggle button
    if (mainDOMElements.themeToggle) {
        mainDOMElements.themeToggle.addEventListener('click', toggleTheme);
    }
};


// --- Mobile Navigation Management ---

/**
 * Toggles the visibility and accessibility attributes of the mobile navigation menu.
 */
const toggleMobileMenu = () => {
    const { mobileMenuToggle, mainNav } = mainDOMElements;
    if (!mobileMenuToggle || !mainNav) return;

    const isActive = mainNav.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active', isActive);
    mobileMenuToggle.setAttribute('aria-expanded', isActive);

    // Toggle scroll lock on the body
    document.body.style.overflow = isActive ? 'hidden' : '';
};


// --- Footer Initialization ---

/**
 * Sets the current year in the footer.
 */
const initializeFooter = () => {
    if (mainDOMElements.currentYearSpan) {
        mainDOMElements.currentYearSpan.textContent = new Date().getFullYear();
    }
};

// --- Initialization ---

/**
 * Sets up all global event listeners and initial configurations.
 */
const initializeGlobalListeners = () => {
    // 1. Theme Initialization
    initializeTheme();

    // 2. Mobile Menu Listener
    if (mainDOMElements.mobileMenuToggle) {
        mainDOMElements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // 3. Footer Initialization
    initializeFooter();
};

// Start the global application logic after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeGlobalListeners);