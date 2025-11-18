// scripts/spotlights.js

async function loadSpotlights() {
  const container = document.getElementById("spotlight-container");

  try {
    const response = await fetch("data/members.json");
    if (!response.ok) throw new Error("Could not fetch members data");

    const members = await response.json();

    // 1. Filter for Gold or Silver members only
    const goldSilver = members.filter(m => m.membership === "Gold" || m.membership === "Silver");

    if (goldSilver.length === 0) {
      container.textContent = "No Gold or Silver member spotlights are currently available.";
      return;
    }

    // 2. Randomly shuffle the filtered array
    const shuffled = goldSilver.sort(() => 0.5 - Math.random());

    // 3. Select the first 3 (or fewer if less than 3 are available)
    const selected = shuffled.slice(0, 3);

    // 4. Generate the HTML for the selected members
    container.innerHTML = selected.map(member => `
            <div class="spotlight-card">
                <img src="${member.image}" alt="${member.name} logo" loading="lazy">
                <h3>${member.name}</h3>
                <p class="membership-level"><strong>Membership:</strong> ${member.membership}</p>
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Address:</strong> ${member.address}</p>
                <a href="${member.website}" target="_blank" class="spotlight-website-link">Visit Website</a>
            </div>
        `).join('');

  } catch (error) {
    console.error("Spotlight fetch error:", error);
    container.textContent = "Unable to load spotlight members due to a data error.";
  }
}

loadSpotlights();