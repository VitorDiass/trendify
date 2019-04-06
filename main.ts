import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as adb from 'adbkit';
const fs = require('fs');
const promise = require('bluebird');






let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    createWindow();
    const client = adb.createClient();

  

/* async function ls() {
  const { stdout, stderr } = await exec('adb push teste.txt storage/3A8F-1A17');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}
ls(); */



 /*  client.listDevices()
.then(function(devices) {
  return promise.map(devices, function(device) {
    return client.push(device.id, '01 - My Champion - Berlin.mp3', 'storage/3A8F-1A17/teste.txt')
      .then(function(transfer) {
        return new Promise(function(resolve, reject) {
          transfer.on('progress', function(stats) {
            console.log('[%s] Pushed %d bytes so far',
              device.id,
              stats.bytesTransferred)
          })
          transfer.on('end', function() {
            console.log('[%s] Push complete', device.id)
            resolve()
          })
          transfer.on('error', reject)
        })
      })
  })
})
.then(function() {
  console.log('Done pushing foo.txt to all connected devices')
})
.catch(function(err) {
  console.error('Something went wrong:', err.stack)
}) */



  client.listDevices()
.then(function(devices) {
  console.log(devices);
  return promise.map(devices, function(device) {
    return client.push(device.id, "", 'storage/3A8F-1A17/teste.txt')
      .then(function(transfer) {
        return new Promise(function(resolve, reject) {
          transfer.on('progress', function(stats) {
            console.log('[%s] Pushed %d bytes so far',
              device.id,
              stats.bytesTransferred)
          })
          transfer.on('end', function() {
            console.log('[%s] Push complete', device.id)
            resolve()
          })
          transfer.on('error', reject)
        })
      })
  })
})
.then(function() {
  console.log('Done pushing foo.txt to all connected devices')
})
.catch(function(err) {
  console.error('Something went wrong:', err.stack)
})


   /*  client.push("0b4210de0204",'teste.txt','storage/3A8F-1A17')
    .then( (transfer : any) => {
        return new Promise( (resolve : any,reject : any) => {
          transfer.on('end', () => {
            console.log("ended");
            resolve();
          })
        } 
        )}
    ) */

    /* ipcMain.on("syncMessage", (event,arg) => {
      console.log(arg);
      event.returnValue = { device : 1, name : "teste" };
    }) */
    // const devices = usb.devices();
    // console.log(devices);
    // let deviceInfo = devices.find( elem => {
    //   return elem.vendorId === 1452 && elem.productId === 34304
    // })

    // if(deviceInfo){
    //   try{
    //   const device = new usb.HID(deviceInfo.path);

    //   if(device) {

    //   }
    // }
    //   catch(e){
    //     console.log(e);
    //   }
    // }
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
