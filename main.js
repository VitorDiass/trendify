"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var adb = require("adbkit");
var fs = require('fs');
var promise = require('bluebird');
var youtube = require('ytdl-core');
var win, serve;
var args = process.argv.slice(1);
serve = args.some(function (val) { return val === '--serve'; });
function createWindow() {
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new electron_1.BrowserWindow({
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
            electron: require(__dirname + "/node_modules/electron")
        });
        win.loadURL('http://localhost:4200');
    }
    else {
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
    win.on('closed', function () {
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
    electron_1.app.on('ready', function () {
        createWindow();
        var client = adb.createClient();
        var syncService = client.syncService("0b4210de0204");
        /* async function ls() {
          const { stdout, stderr } = await exec('adb push teste.txt storage/3A8F-1A17');
          console.log('stdout:', stdout);
          console.log('stderr:', stderr);
        }
        ls(); */
        electron_1.ipcMain.on("syncMessage", function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (syncService) {
                syncService.then(function (service) {
                    var i = 0;
                    args.forEach(function (url) {
                        var res = youtube(url, { filter: 'audioonly' });
                        service.push(res, 'storage/3A8F-1A17/' + i).then(function (transfer) {
                            return new Promise(function (resolve, reject) {
                                transfer.on('progress', function (stats) {
                                    console.log('[%s] Pushed %d bytes so far', "0b4210de0204", stats.bytesTransferred);
                                });
                                transfer.on('end', function () {
                                    console.log('[%s] Push complete', "0b4210de0204");
                                    event.returnValue = "Concluido : " + url;
                                    i++;
                                    resolve();
                                });
                                transfer.on('error', reject);
                            });
                        });
                    });
                });
            }
        });
    });
    /* args.forEach(async url => {

      await new Promise((resolve,reject) => {
        let res = youtube(url, { filter: 'audioonly' });
       
        client.push("0b4210de0204", res, 'storage/3A8F-1A17/' + i).then(transfer => {
          return new Promise((resolve, reject) => {
            transfer.on('progress', function (stats) {
              console.log('[%s] Pushed %d bytes so far',
                "0b4210de0204",
                stats.bytesTransferred)
            })
            transfer.on('end', function () {
              console.log('[%s] Push complete', "0b4210de0204")
              event.returnValue = `Concluido : ${url}`;
              resolve();
            })
            transfer.on('error', reject)
            
          }).then(()=>{i++;client = adb.createClient();resolve()});
        })
      })
     
    }) */
    // https://www.youtube.com/watch?v=IGQBtbKSVhY
    /* ipcMain.on("syncMessage", (event,...args) => {
      let promisesArray : Array<Promise<any>> = new Array<Promise<any>>();
      args.forEach(element => {
        promisesArray.push( new Promise((resolve,reject) => {
          console.log(element);
            const res = youtube(element, { filter: 'audioonly' });
            res.on('end', () => {
              console.log("aqui");
              resolve();
            });
            res.on('data', (chunk) => {
              console.log(res);
              console.log(chunk);
            });
            res.on('error', () => {
              console.log("error");
              event.returnValue = "error";
              reject();
            })
        }))
      });
      Promise.all(promisesArray).then(res => {
        console.log(res);
        res.forEach(elem => {
            client.push("0b4210de0204",elem, 'storage/3A8F-1A17/teste.mp3').then( transfer => {
              return new Promise( (resolve,reject) =>{
                transfer.on('progress', function (stats) {
                  console.log('[%s] Pushed %d bytes so far',
                  "0b4210de0204",
                    stats.bytesTransferred)
                })
                transfer.on('end', function () {
                  console.log('[%s] Push complete', "0b4210de0204")
                  resolve();
                  
                })
                transfer.on('error', reject)
              })
          })
          }) */
    /* client.listDevices()
    .then(function (devices) {
      return promise.map(devices, function (device) {
        console.log(device.id);
        return promise.map(res, (elem) => {
        return client.push(device.id, elem, 'storage/3A8F-1A17/teste.mp3')
          .then(function (transfer) {
            return new Promise(function (resolve, reject) {
              transfer.on('progress', function (stats) {
                console.log('[%s] Pushed %d bytes so far',
                  device.id,
                  stats.bytesTransferred)
              })
              transfer.on('end', function () {
                console.log('[%s] Push complete', device.id)
                resolve()
              })
              transfer.on('error', reject)
            })
          })
        })
      })
    })
    .then(function () {
      console.log('Done pushing foo.txt to all connected devices');
      event.returnValue = "finished";
    })
    .catch(function (err) {
      console.error('Something went wrong:', err.stack)
    })
 */
    /*  const readableStream = youtube('https://www.youtube.com/watch?v=5uzgHTe9vNY', { filter: 'audioonly' });
     readableStream.on("progress", (res) => {
       console.log(res);
     })
     
     client.listDevices()
       .then(function (devices) {
         return promise.map(devices, function (device) {
           return client.push(device.id, readableStream, 'storage/3A8F-1A17/teste.txt')
             .then(function (transfer) {
               return new Promise(function (resolve, reject) {
                 transfer.on('progress', function (stats) {
                   console.log('[%s] Pushed %d bytes so far',
                     device.id,
                     stats.bytesTransferred)
                 })
                 transfer.on('end', function () {
                   console.log('[%s] Push complete', device.id)
                   resolve()
                 })
                 transfer.on('error', reject)
               })
             })
         })
       })
       .then(function () {
         console.log('Done pushing foo.txt to all connected devices')
       })
       .catch(function (err) {
         console.error('Something went wrong:', err.stack)
       }) */
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
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
//# sourceMappingURL=main.js.map