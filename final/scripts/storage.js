// Local storage utilities
export function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

export function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

export function loadUserPreferences() {
    const theme = getFromLocalStorage('theme') || 'light';
    const itemsPerPage = getFromLocalStorage('itemsPerPage') || 10;

    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);

    return { theme, itemsPerPage };
}

export function setupThemeToggle() {
    // You can add a theme toggle button in the future
    // For now, theme is set based on user preference
}