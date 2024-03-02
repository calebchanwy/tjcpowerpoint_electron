const { ipcRenderer } = require('electron');

// Function to minimize the window
function minimizeWindow() {
    ipcRenderer.send('minimize-window');
  }
  
  // Function to close the window
  function closeWindow() {
    ipcRenderer.send('close-window');
  }

// Listen for the 'load-title-bar' message
ipcRenderer.on('load-title-bar', (event, titleBarContent) => {
  document.getElementById('title-bar-container').innerHTML = titleBarContent;

  // Attach event listeners to your custom buttons
  document.getElementById('minimise-btn').addEventListener('click', minimizeWindow);
  document.getElementById('close-btn').addEventListener('click', closeWindow);
});