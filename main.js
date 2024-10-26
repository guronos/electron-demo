const { app, BrowserWindow, nativeTheme } = require('electron/main')
const path = require('node:path')


const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
    // frame: false
  })
  nativeTheme.themeSource = 'dark'
win.setBackgroundColor('rgb(0, 0, 0)')
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
