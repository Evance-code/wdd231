// main.js - Main application functionality for all pages
document.addEventListener('DOMContentLoaded', function () {
    initializeApplication();
});

function initializeApplication() {
    // Set current year in footer
    setCurrentYear();

    // Setup navigation
    setupNavigation();

    // Load user preferences (theme)
    loadUserPreferences();

    // Initialize page-specific functionality (like home page dynamic content)
    initializePageSpecificFeatures();

    // Setup theme toggle if available
    setupThemeToggle();
}

// Set current year in footer
function setCurrentYear() {
    const yearElements = document.querySelectorAll('#currentYear');
    yearElements.forEach(element => {
        if (element) {
            element.textContent = new Date().getFullYear();
        }
    });
}

// Navigation functionality
function setupNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            const isActive = mainNav.classList.contains('active');

            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');

            // Update aria-expanded attribute for accessibility
            menuToggle.setAttribute('aria-expanded', !isActive);

            // Prevent body scroll when menu is open on mobile
            document.body.style.overflow = isActive ? '' : 'hidden';
        });

        // Close mobile menu when clicking on a link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                // Use a short timeout to allow navigation before closing animation starts
                setTimeout(() => {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }, 150);
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target) && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
}

// User preferences and local storage
function loadUserPreferences() {
    const theme = getFromLocalStorage('theme') || 'light';
    // const itemsPerPage = getFromLocalStorage('itemsPerPage') || 10; // Left commented as it's not currently used

    // Apply theme
    applyTheme(theme);

    // return { theme, itemsPerPage }; // Left commented
}

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        // Fallback for Safari private mode or full storage
        console.error('Error saving to localStorage:', error);
        // showNotification('Local storage is disabled or full.', 'error'); // Can be used if notification styles are in main.css
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            applyTheme(newTheme);
            saveToLocalStorage('theme', newTheme);

            // Update toggle button text/icon
            updateThemeToggleButton(themeToggle, newTheme);
        });

        // Initialize toggle button state
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        updateThemeToggleButton(themeToggle, currentTheme);
    }
}

function updateThemeToggleButton(button, theme) {
    // This function assumes a button element with id="themeToggle" exists in the HTML
    if (theme === 'dark') {
        button.innerHTML = '☀️ Light Mode';
        button.setAttribute('aria-label', 'Switch to light mode');
    } else {
        button.innerHTML = '🌙 Dark Mode';
        button.setAttribute('aria-label', 'Switch to dark mode');
    }
}

// Page-specific initialization
function initializePageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    switch (currentPage) {
        case 'index.html':
        case '':
            initializeHomePage();
            break;
        case 'aircraft.html':
            // Assume aircraft.html will load a dedicated script or extend functionality here
            break;
        case 'weather.html':
            // Assume weather.html will load a dedicated script or extend functionality here
            break;
        default:
            console.log('Initializing page:', currentPage);
    }
}

function initializeHomePage() {
    console.log('Initializing home page features...');

    // Update aircraft count dynamically from JSON
    updateAircraftCount();

    // Add any home page specific animations or interactions
    initializeHeroAnimations();
    initializeFeatureCards();
}

/**
 * Fetches aircraft data from JSON and updates count elements.
 */
async function updateAircraftCount() {
    const countElement = document.getElementById('aircraftCount');
    const descriptionCountElement = document.getElementById('dynamicAircraftCount'); // From the feature card

    if (!countElement && !descriptionCountElement) {
        return; // Exit if elements are not found (e.g., if we are on another page)
    }

    try {
        // Fetch the JSON file containing the aircraft array
        const response = await fetch('data/aircraft.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const aircraftData = await response.json();

        // Check if the data is an array and count the items
        if (Array.isArray(aircraftData)) {
            const count = aircraftData.length;

            if (countElement) {
                countElement.textContent = count;
            }
            if (descriptionCountElement) {
                // Updates the '15+' text inside the feature card <p> tag
                descriptionCountElement.textContent = count;
            }
        } else {
            console.warn('JSON data is not an array. Cannot determine aircraft count.');
            // Fallback to the default HTML count (e.g., '15')
        }
    } catch (error) {
        console.error('Error fetching aircraft data:', error);
        // Fallback for user: show a notification if fetching failed
        // Note: 'aircraft.json' needs to be placed in a 'data' folder at the root.
        showNotification('Failed to load dynamic aircraft count. Check console for details.', 'error');
    }
}


function initializeHeroAnimations() {
    // Animation logic
    const hero = document.querySelector('.hero');
    if (hero) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Stop observing once it has animated
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 }); // Trigger when 20% of the element is visible

        observer.observe(hero);
    }
}

function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        // CSS variable for staggered animation delay
        card.style.setProperty('--delay', `${index * 0.1}s`);

        // Add simple hover effects
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.05)';
        });
    });
}

// Utility functions (Debounce and Throttle remain unchanged as they are excellent utilities)

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Error handling (Notification system remains self-contained)

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="Close notification">&times;</button>
    `;

    // Add styles if not already added (for a self-contained error/info system)
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        // Note: The notification styles rely on a CSS variable --accent-color, which should be defined in your styles.css
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 6px;
                color: white;
                z-index: 10000;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                transform: translateX(420px);
                transition: transform 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-info { background: var(--accent-color, #007bff); }
            .notification-success { background: #48bb78; }
            .notification-error { background: #f56565; }
            .notification-warning { background: #ed8936; }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// **Removed the self-injecting CSS for .feature-card and @keyframes fadeInUp**
// **This CSS should be moved to styles.css**



// Service Worker registration (optional) and Performance monitoring remain unchanged.
// Error boundary and Unhandled promise rejection handler remain unchanged.