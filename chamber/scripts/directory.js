// Directory page specific functionality
document.addEventListener('DOMContentLoaded', async function () {
    const memberDisplay = document.getElementById('memberDisplay');
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');

    let members = [];
    let currentView = 'grid';

    // Fetch member data
    async function getMembers() {
        try {
            const response = await fetch('data/members.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.members;
        } catch (error) {
            console.error('Error fetching member data:', error);
            return [];
        }
    }

    // Display members based on current view
    function displayMembers() {
        memberDisplay.innerHTML = '';
        memberDisplay.className = `members-grid ${currentView}-view`;

        members.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.className = `member-card ${currentView}-view`;

            const membershipLevels = {
                1: { name: 'Member', class: 'membership-1' },
                2: { name: 'Silver', class: 'membership-2' },
                3: { name: 'Gold', class: 'membership-3' }
            };

            const membership = membershipLevels[member.membership];

            if (currentView === 'grid') {
                memberCard.innerHTML = `
                    <div class="member-logo">
                        ${member.image ? `<img src="images/${member.image}" alt="${member.name} logo" loading="lazy">` : member.name.charAt(0)}
                    </div>
                    <div class="member-info">
                        <h3>${member.name}</h3>
                        <p class="member-industry">${member.industry}</p>
                        <p class="member-address">${member.address}</p>
                        <div class="member-contact">
                            <p class="member-phone">${member.phone}</p>
                            <p class="member-website">
                                <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
                            </p>
                        </div>
                        <span class="membership-badge ${membership.class}">${membership.name} Member</span>
                    </div>
                `;
            } else {
                // List view
                memberCard.innerHTML = `
                    <div class="member-logo">
                        ${member.image ? `<img src="images/${member.image}" alt="${member.name} logo" loading="lazy">` : member.name.charAt(0)}
                    </div>
                    <div class="member-info">
                        <h3>${member.name}</h3>
                        <p class="member-industry">${member.industry}</p>
                        <p class="member-address">${member.address}</p>
                    </div>
                    <div class="member-contact">
                        <p class="member-phone">${member.phone}</p>
                        <p class="member-website">
                            <a href="${member.website}" target="_blank" rel="noopener">Website</a>
                        </p>
                        <span class="membership-badge ${membership.class}">${membership.name}</span>
                    </div>
                `;
            }

            memberDisplay.appendChild(memberCard);
        });
    }

    // View toggle functionality
    function setActiveView(view) {
        currentView = view;
        gridViewBtn.classList.toggle('active', view === 'grid');
        listViewBtn.classList.toggle('active', view === 'list');
        displayMembers();
    }

    // Event listeners for view toggles
    gridViewBtn.addEventListener('click', () => setActiveView('grid'));
    listViewBtn.addEventListener('click', () => setActiveView('list'));

    // Initialize
    try {
        members = await getMembers();
        if (members.length > 0) {
            displayMembers();
        } else {
            memberDisplay.innerHTML = '<p>No member data available.</p>';
        }
    } catch (error) {
        memberDisplay.innerHTML = '<p>Error loading member directory. Please try again later.</p>';
        console.error('Error initializing directory:', error);
    }
});