// scripts/spotlights.js
async function loadSpotlights() {
    try {
        const response = await fetch("data/members.json");
        if (!response.ok) throw new Error("Could not fetch members data");

        const members = await response.json();
        const goldSilver = members.filter(m => m.membership === "Gold" || m.membership === "Silver");

        const shuffled = goldSilver.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        const container = document.getElementById("spotlight-container");
        container.innerHTML = selected.map(member => `
      <div class="spotlight-card">
        <img src="${member.image}" alt="${member.name} logo" loading="lazy">
        <h3>${member.name}</h3>
        <p><strong>Membership:</strong> ${member.membership}</p>
        <p><strong>Phone:</strong> ${member.phone}</p>
        <p><strong>Address:</strong> ${member.address}</p>
        <a href="${member.website}" target="_blank">Visit Website</a>
      </div>
    `).join('');
    } catch (error) {
        console.error("Spotlight fetch error:", error);
        document.getElementById("spotlight-container").textContent = "Unable to load spotlight members.";
    }
}

loadSpotlights();
