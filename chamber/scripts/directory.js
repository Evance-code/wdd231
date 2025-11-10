// Global variables
let members = [];
let currentView = 'grid';

// Fetch and display members
async function getMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        members = data.members;
        displayMembers(currentView);
    } catch (error) {
        console.error('Error fetching member data:', error);
        displayError();
    }
}

// Display members
function displayMembers(view) {
    const memberDisplay = document.getElementById('memberDisplay');
    memberDisplay.innerHTML = '';

    members.forEach(member => {
        const memberCard = createMemberCard(member, view);
        memberDisplay.appendChild(memberCard);
    });

    // Apply correct layout class
    memberDisplay.className = view === 'grid'
        ? 'members-grid grid-view'
        : 'members-grid list-view';
}

// Create member card (NO LOGOS)
function createMemberCard(member, view) {
    const card = document.createElement('div');
    card.className = `member-card ${view}-view`;

    const membershipLevels = {
        1: { name: 'Member', class: 'membership-1' },
        2: { name: 'Silver', class: 'membership-2' },
        3: { name: 'Gold', class: 'membership-3' }
    };

    const membership = membershipLevels[member.membershipLevel] || { name: 'Member', class: 'membership-1' };

    // Clean HTML without any logo elements
    card.innerHTML = `
        <div class="member-info">
            <h3>${member.name}</h3>
            <p class="member-address">${member.address}</p>
            <p class="member-phone">${member.phone}</p>
            <p class="member-industry">${member.industry}</p>
        </div>
        <div class="member-contact">
            <p class="member-website">
                <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
            </p>
            <span class="membership-badge ${membership.class}">${membership.name}</span>
        </div>
    `;

    return card;
}

// Display fallback error
function displayError() {
    const memberDisplay = document.getElementById('memberDisplay');
    memberDisplay.innerHTML = `
        <div class="error-message">
            <p>⚠️ Sorry, we couldn't load the member directory. Please try again later.</p>
        </div>
    `;
}

// Handle view toggle
function setupViewToggle() {
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');

    gridViewBtn.addEventListener('click', () => {
        if (currentView !== 'grid') {
            currentView = 'grid';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            displayMembers(currentView);
        }
    });

    listViewBtn.addEventListener('click', () => {
        if (currentView !== 'list') {
            currentView = 'list';
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            displayMembers(currentView);
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    getMembers();
    setupViewToggle();
});