const now = new Date();
const modified = document.lastModified;

document.querySelector("#lastModified").textContent = `Page loaded: ${now.toLocaleString()} | Last file update: ${modified}`;
