// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron');

console.log(window.FaceDetector);

const start = document.querySelector('input#start')

start.addEventListener('click', () => {
  ipcRenderer.send('startflying');
})

const stop = document.querySelector('input#stop');
stop.addEventListener('click', () => {
  ipcRenderer.send('stopflying');
});
