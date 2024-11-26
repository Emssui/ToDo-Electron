const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, 
    },
  });

  mainWindow.loadFile('index.html');
});

// Path to the JSON file
const filePath = path.join(__dirname, 'form-data.json');

// Handle saving form data
ipcMain.on('save-form-data', (event, formData) => {
  // If the file doesn't exist, create it with an empty array
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
  }

  // Read the existing data, append the new data, and save it back
  const existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  existingData.push(formData);
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

  console.log('Data saved:', formData);
});

// Handle retrieving form data
ipcMain.on('get-form-data', (event) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  event.sender.send('form-data-response', data);
});

// Handle deleting form data
ipcMain.on('delete-form-data', (event, id) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
  }

  // Read the existing data, filter out the item with the specified ID, and save it back
  const existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const updatedData = existingData.filter((item) => item.id !== id);
  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));

  console.log(`Data with ID ${id} deleted.`);
  event.reply('delete-success'); // Notify the renderer process that deletion was successful
});
