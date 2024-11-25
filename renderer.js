const { ipcRenderer } = require('electron');

// Handle form submission
document.querySelector('#myForm').addEventListener('submit', (event) => {
  event.preventDefault();

  // Collect form data
  const formData = {
    name: event.target.name.value,
    email: event.target.email.value,
    age: event.target.age.value,
  };

  // Send form data to the main process
  ipcRenderer.send('save-form-data', formData);

  // Clear the form
  event.target.reset();

  // Refresh the displayed data
  loadData();
});

// Function to load data from the JSON file
function loadData() {
  ipcRenderer.send('get-form-data'); // Request data from main process

  // Listen for the data response
  ipcRenderer.once('form-data-response', (event, data) => {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = ''; // Clear existing table rows

    // Populate table with the data
    data.forEach((item) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.email}</td>
        <td>${item.age}</td>
      `;
      tableBody.appendChild(row);
    });
  });
}

// Load data when the page loads
window.onload = loadData;
