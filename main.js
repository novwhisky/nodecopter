// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// Face detection
app.commandLine.appendSwitch('enable-experimental-web-platform-features', true);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
    app.quit()
  // }

  pngStream.close();
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


var arDrone = require('ar-drone');
var client  = arDrone.createClient({ frameRate: 1 });
var pngStream = client.getPngStream();

client.config('control:altitude_max', 3000);
client.config('general:navdata_demo', 'FALSE');

client.on('batteryChange', function(data) {
  console.log('Battery ' + data + '%');
});

ipcMain.on('startflying', () => {
  pngStream.on('data', data => {
    if(data) {
      const img = 'data:image/png;base64,' + data.toString('base64');
      // console.log(img);
      mainWindow.webContents.send('pngdata', img);
    }
  })

  // FLIGHT STUFF
  client.takeoff();

  client.after(3000, function() {
    this.up(0.5);

  }).after(5000, function() {
    this.stop();
  });
})

ipcMain.on('shiver', () => {
  // client._udpControl.flush();

  client.after(0, function() {
    this.stop();
    this.animateLeds('blinkRed', 10, 1);
    this.clockwise(0.5);
  }).after(3000, function() {
    this.stop();
    this.front(0.2);
  }).after(2000, function() {
    this.stop();
    this.animate('phiM30Deg');
  }).after(2000, function() {
    this.stop();
    mainWindow.webContents.send('animationDone');
  });
});


ipcMain.on('runaway', () => {
  console.log('Run away' )
});

ipcMain.on('stopflying', () => {
  client.stop();
  client.land();

});
