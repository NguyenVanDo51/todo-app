const electron = require('electron');
const { Notification, ipcMain, Tray } = require('electron');

const { app, Menu } = electron;
const { BrowserWindow } = electron;
const path = require('path');
const isDev = require('electron-is-dev');

let win; // khai báo biên win dùng để tạo lên một cửa sổ window của app

// Hàm tạo cửa sổ app
function createWindow() {
    win = new BrowserWindow({
      width: 1170,
      minWidth: 1170,
      height: 768,
      webPreferences: {
          nodeIntegration: true,
          nodeIntegrationInWorker: true,
          contextIsolation: false,
      },
    });
    const template = [
      {
         label: 'Edit',
         submenu: [
            {
               role: 'undo',
            },
            {
               role: 'redo',
            },
            {
               type: 'separator',
            },
            {
               role: 'cut',
            },
            {
               role: 'copy',
            },
            {
               role: 'paste',
            },
         ],
      },

      {
         role: 'help',
         submenu: [
            {
               label: 'Abou BLO',
            },
            {
              role: 'toggleDevTools',
            },
         ],
      },
   ];

   const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // win.loadURL('http://localhost:3000');
    win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    //win.webContents.openDevTools();

    win.on('close', () => {
        win = null;
    });
}

app.on('ready', () => {
  createWindow();
  ipcMain.on('ELECT_NOTIFICATION', (_, payload) => {
    const notification = {
      title: payload.user_info.name,
      body: payload.text,
      icon: payload.user_info.avatar,
    };
    new Notification(notification).show();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (win == null) {
      createWindow();
  }
});
