// Modal functionality
export function openModal(content, modalId = 'aircraftModal') {
    const modal = document.getElementById(modalId);
    let modalBody;

    if (modalId === 'weatherModal') {
        modalBody = document.getElementById('weatherModalBody');
    } else {
        modalBody = document.getElementById('modalBody');
    }

    if (modal && modalBody) {
        modalBody.innerHTML = content;
        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'block';

        // Focus management for accessibility
        const closeButton = modal.querySelector('.close-modal');
        if (closeButton) {
            closeButton.focus();
        }

        // Trap focus inside modal
        trapFocus(modal);
    }
}

export function closeModal(modalId = 'aircraftModal') {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
    }
}

function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleTabKey(e) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    modal.addEventListener('keydown', handleTabKey);

    // Remove event listener when modal closes
    const observer = new MutationObserver(() => {
        if (modal.style.display === 'none') {
            modal.removeEventListener('keydown', handleTabKey);
            observer.disconnect();
        }
    });

    observer.observe(modal, { attributes: true, attributeFilter: ['style'] });
}

// Setup global modal event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Close modal when clicking X
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal.id);
                }
            });
        }
    });
});
// minimal main script for theme toggle and small UI helpers
(function () {
    const t = document.getElementById('themeToggle');
    if (!t) return;
    const root = document.documentElement;
    t.addEventListener('click', () => {
        const dark = root.getAttribute('data-theme') === 'dark';
        if (dark) { root.removeAttribute('data-theme'); t.textContent = '☀️ Theme'; }
        else { root.setAttribute('data-theme', 'dark'); t.textContent = '🌙 Dark'; }
    });
})();
