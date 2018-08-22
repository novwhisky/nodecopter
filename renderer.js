// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron');

const start = document.querySelector('input#start')

let animationRunning = false;

start.addEventListener('click', () => {
  ipcRenderer.send('startflying');
})

const stop = document.querySelector('input#stop');
stop.addEventListener('click', () => {
  ipcRenderer.send('stopflying');
});

ipcRenderer.on('animationDone', () => {
  animationRunning = false;
})

ipcRenderer.on('pngdata', (event, data) => {
  preview.src = data;

  var faceDetector = new FaceDetector({ maxDetectedFaces: 2 });
  faceDetector.detect(preview)
    .then(faces => {
      if(faces.length)
        console.log(faces.length, faces);

      if(faces.length > 0 && animationRunning === false) {
        animationRunning = true;
        ipcRenderer.send('shiver');
       }
    })
    .catch(e => {
      // console.error("Boo, Face Detection failed: " + e);
    });
})


