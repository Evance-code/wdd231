// Global variables
let members = [];
let currentView = 'grid';

// Async function to fetch member data
async function getMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        members = data.members;
        displayMembers(currentView);
    } catch (error) {
        console.error('Error fetching member data:', error);
        displayError();
    }
}

// Display members based on current view
function displayMembers(view) {
    const memberDisplay = document.getElementById('memberDisplay');
    memberDisplay.innerHTML = '';

    members.forEach(member => {
        const memberCard = createMemberCard(member, view);
        memberDisplay.appendChild(memberCard);
    });

    // Update classes for styling
    memberDisplay.className = view === 'grid' ? 'members-grid grid-view' : 'members-grid list-view';
}

// Create member card element
function createMemberCard(member, view) {
    const card = document.createElement('div');
    card.className = `member-card ${view}-view`;

    const membershipLevels = {
        1: { name: 'Member', class: 'membership-1' },
        2: { name: 'Silver', class: 'membership-2' },
        3: { name: 'Gold', class: 'membership-3' }
    };

    const membership = membershipLevels[member.membershipLevel];

    if (view === 'grid') {
        card.innerHTML = `
            <div class="member-logo">
                <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
            </div>
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
    } else {
        // List view - simplified without image
        card.innerHTML = `
            <div class="member-info">
                <h3>${member.name}</h3>
                <p class="member-address">${member.address}</p>
                <p class="member-phone">${member.phone}</p>
                <p class="member-industry">${member.industry}</p>
            </div>
            <div class="member-contact">
                <p class="member-website">
                    <a href="${member.website}" target="_blank" rel="noopener">Website</a>
                </p>
                <span class="membership-badge ${membership.class}">${membership.name}</span>
            </div>
        `;
    }

    return card;
}

// Display error message
function displayError() {
    const memberDisplay = document.getElementById('memberDisplay');
    memberDisplay.innerHTML = `
        <div class="error-message">
            <p>Sorry, we couldn't load the member directory. Please try again later.</p>
        </div>
    `;
}

// View toggle functionality
function setupViewToggle() {
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');

    gridViewBtn.addEventListener('click', function () {
        currentView = 'grid';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        displayMembers(currentView);
    });

    listViewBtn.addEventListener('click', function () {
        currentView = 'list';
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        displayMembers(currentView);
    });
}

// Initialize the directory page
document.addEventListener('DOMContentLoaded', function () {
    getMembers();
    setupViewToggle();
});