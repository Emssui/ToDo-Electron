const { ipcRenderer } = require('electron');

// Handle form submission
document.querySelector('#myForm').addEventListener('submit', (event) => {
  event.preventDefault();

  // Generate a unique ID
  const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  // Collect form data
  const formData = {
    name: event.target.name.value,
    id: uniqueId,
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
        <td style="cursor: pointer; color: red;" onclick="handleDelete('${item.id}')">x</td>
      `;
      tableBody.appendChild(row);
    });
  });
}

// Load data when the page loads
window.onload = loadData;

// Function to handle deleting a To-Do
function handleDelete(id) {
  ipcRenderer.send('delete-form-data', id); // Send delete request to the main process

  // Refresh the displayed data after deletion
  ipcRenderer.once('delete-success', () => {
    loadData();
  });
}
