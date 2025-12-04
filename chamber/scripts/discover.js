// ==========================
// Last Visit Message
// ==========================
const lastVisitEl = document.getElementById("last-visit");
const now = Date.now();
const lastVisit = localStorage.getItem("lastVisit");

if (!lastVisit) {
    lastVisitEl.textContent = "Welcome! Let us know if you have any questions.";
} else {
    const diffMs = now - Number(lastVisit);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
        lastVisitEl.textContent = "Back so soon! Awesome!";
    } else if (diffDays === 1) {
        lastVisitEl.textContent = "You last visited 1 day ago.";
    } else {
        lastVisitEl.textContent = `You last visited ${diffDays} days ago.`;
    }
}

localStorage.setItem("lastVisit", now.toString());

// ==========================
// Fetch Member Data from JSON
// ==========================
fetch("data/discover.json")
    .then(response => {
        if (!response.ok) throw new Error("HTTP error " + response.status);
        return response.json();
    })
    .then(data => {
        const memberGrid = document.getElementById("member-cards");
        memberGrid.innerHTML = "";

        data.forEach((member, index) => {
            const card = document.createElement("div");
            card.className = "member-card";

            card.innerHTML = `
                <h2>${member.name}</h2>
                <figure>
                    <img src="${member.image}" alt="${member.name}" loading="lazy">
                </figure>
                <address>${member.address}</address>
                <p>${member.description}</p>
                <button class="learn-btn">Learn More</button>
            `;

            memberGrid.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Error loading member data:", error);
        document.getElementById("member-cards").innerHTML = "<p>Failed to load members. Please try again later.</p>";
    });
