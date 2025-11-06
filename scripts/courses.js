/* Dynamic course list, filtering, and total credits */
document.addEventListener("DOMContentLoaded", () => {
    const courses = [
        { code: "CSE110", name: "Introduction to Programming", credits: 2, category: "CSE", completed: true },
        { code: "CSE111", name: "Programming with Functions", credits: 2, category: "CSE", completed: true },
        { code: "WDD130", name: "Web Fundamentals", credits: 2, category: "WDD", completed: true },
        { code: "WDD131", name: "Dynamic Web Fundamentals", credits: 2, category: "WDD", completed: true },
        { code: "CSE210", name: "Programming with Classes", credits: 2, category: "CSE", completed: true },
        { code: "WDD231", name: "Web Frontend Development I", credits: 2, category: "WDD", completed: false }
    ];

    const container = document.getElementById("coursesContainer");
    const creditsElement = document.getElementById("creditsCount");
    const filterButtons = document.querySelectorAll(".filter-buttons button");

    function render(list) {
        container.innerHTML = "";
        list.forEach(course => {
            const card = document.createElement("div");
            card.className = `course-card ${course.completed ? "completed" : ""}`;
            card.setAttribute("role", "listitem");
            card.innerHTML = `
                <strong>${course.code}</strong> — ${course.name}
                <p>${course.credits} credits • ${course.category} • ${course.completed ? "Completed" : "In progress"}</p>
            `;
            container.appendChild(card);
        });

        // Calculate total credits using reduce function
        const totalCredits = list.reduce((sum, course) => sum + course.credits, 0);
        creditsElement.textContent = totalCredits;
    }

    function setActiveButton(activeButton) {
        filterButtons.forEach(button => button.classList.remove("active"));
        activeButton.classList.add("active");
    }

    // Event handlers for filter buttons
    document.getElementById("showAll").addEventListener("click", (e) => {
        setActiveButton(e.target);
        render(courses);
    });

    document.getElementById("showCSE").addEventListener("click", (e) => {
        setActiveButton(e.target);
        render(courses.filter(c => c.category === "CSE"));
    });

    document.getElementById("showWDD").addEventListener("click", (e) => {
        setActiveButton(e.target);
        render(courses.filter(c => c.category === "WDD"));
    });

    // Initial render
    render(courses);
});