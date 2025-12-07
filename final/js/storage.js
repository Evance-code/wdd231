// js/storage.js

const form = document.getElementById('booking-form');
const submittedData = document.getElementById('submitted-data');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            service: form.service.value,
            date: form.date.value,
            message: form.message.value
        };
        localStorage.setItem('lastBooking', JSON.stringify(formData));
        window.location.href = 'form-action.html';
    });
}

if (submittedData) {
    const data = JSON.parse(localStorage.getItem('lastBooking'));
    if (data) {
        for (const [key, value] of Object.entries(data)) {
            const li = document.createElement('li');
            li.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
            submittedData.appendChild(li);
        }
    } else {
        submittedData.innerHTML = '<li>No submission data found.</li>';
    }
}
