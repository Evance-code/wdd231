const courses = [
    { code: 'CSE 110', name: 'Programming Building Blocks', credits: 3, completed: true },
    { code: 'WDD 130', name: 'Web Fundamentals', credits: 3, completed: true },
    { code: 'CSE 111', name: 'Programming With Functions', credits: 3, completed: false },
    { code: 'WDD 131', name: 'Dynamic Web Fundamentals', credits: 3, completed: true },
    { code: 'CSE 210', name: 'Programming with Classes', credits: 3, completed: false },
    { code: 'WDD 231', name: 'Web Frontend Development I', credits: 3, completed: false }
];

function filterCourses(filter) {
    const container = document.getElementById('course-container');
    container.innerHTML = '';
    
    const filtered = courses.filter(course => 
        filter === 'all' || course.code.startsWith(filter)
    );

    filtered.forEach(course => {
        const div = document.createElement('div');
        div.className = `course-card ${course.completed ? 'completed' : ''}`;
        div.innerHTML = `
            <h3>${course.code}</h3>
            <p>${course.name}</p>
            <p>Credits: ${course.credits}</p>
        `;
        container.appendChild(div);
    });

    // Update credit total
    document.getElementById('credit-total').textContent = filtered
        .reduce((sum, course) => sum + course.credits, 0);
}

// Initial load
filterCourses('all');