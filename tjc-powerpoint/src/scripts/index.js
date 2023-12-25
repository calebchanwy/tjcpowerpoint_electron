const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const templatesPath = path.resolve(__dirname, '..', 'templates');
const assetsPath = path.resolve(__dirname, '..', 'assets');

let mainWindow;

// Listen for the 'minimize-window' message from the renderer process
ipcMain.on('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

// Listen for the 'close-window' message from the renderer process
ipcMain.on('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 650,
    frame: false,
    icon: path.join(assetsPath, 'tjcbirdlogo.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation:false,
    },

  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(templatesPath, 'index.html'));

  // Handle window closed event
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Load the title bar HTML content and send it to the renderer process
  const titleBarContent = fs.readFileSync(path.join(templatesPath, 'titleBar.html'), 'utf8');
  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.send('load-title-bar', titleBarContent);
  });

  mainWindow.webContents.openDevTools();
};

// Check if another instance is already running
const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
  // If another instance is already running, quit the new instance
  app.quit();
} else {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed, except on macOS.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Listen for the second instance attempting to run
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // If a second instance is launched, focus on the main window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}


