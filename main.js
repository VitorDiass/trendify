"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
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
var connectedDeviceId = null;
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
    electron_1.app.on('ready', function () { return __awaiter(_this, void 0, void 0, function () {
        var client;
        var _this = this;
        return __generator(this, function (_a) {
            createWindow();
            client = adb.createClient();
            /* async function ls() {
              const { stdout, stderr } = await exec('adb push teste.txt storage/3A8F-1A17');
              console.log('stdout:', stdout);
              console.log('stderr:', stderr);
            }
            ls(); */
            electron_1.ipcMain.on("getConnectedDevices", function (event, args) {
                if (client) {
                    client.listDevicesWithPaths().then(function (devices) {
                        //console.log(devices);
                        event.sender.send("getConnectedDevicesResp", devices);
                    });
                }
            });
            electron_1.ipcMain.on("setConnectedDevice", function (event, args) {
                if (args) {
                    connectedDeviceId = args;
                    event.sender.send("setConnectedDeviceResp", args);
                }
            });
            //getState has to receive the devices ID;
            /*   ipcMain.on("getState", (event, ...args)=> {
                if(client){
                  let res = [];
                  args.forEach(async device => {
                    await client.getState(device.id).then(deviceState => {
                      console.log(deviceState);
                      res.push(deviceState);
                    })
                  })
                  event.sender.send("getStateResp",res);
          
                  
                }
              }) */
            electron_1.ipcMain.on("download", function (event) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return __awaiter(_this, void 0, void 0, function () {
                    var i, _loop_1, _a, args_1, arg;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                i = 1;
                                if (!connectedDeviceId) return [3 /*break*/, 5];
                                _loop_1 = function (arg) {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                    var res = youtube(arg, { filter: 'audioonly' });
                                                    client.push(connectedDeviceId, res, 'storage/3A8F-1A17/' + i).then(function (transfer) {
                                                        return new Promise(function (resolve, reject) {
                                                            transfer.on('progress', function (stats) {
                                                                console.log('[%s] Pushed %d bytes so far', "0b4210de0204", stats.bytesTransferred);
                                                            });
                                                            transfer.on('end', function () {
                                                                console.log('[%s] Push complete', "0b4210de0204");
                                                                event.sender.send("downloadCompleted", "Concluido : " + url);
                                                                resolve();
                                                            });
                                                            transfer.on('error', reject);
                                                        }).then(function () { i++; client = adb.createClient(); resolve(); });
                                                    });
                                                })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                };
                                _a = 0, args_1 = args;
                                _b.label = 1;
                            case 1:
                                if (!(_a < args_1.length)) return [3 /*break*/, 4];
                                arg = args_1[_a];
                                return [5 /*yield**/, _loop_1(arg)];
                            case 2:
                                _b.sent();
                                _b.label = 3;
                            case 3:
                                _a++;
                                return [3 /*break*/, 1];
                            case 4: return [3 /*break*/, 6];
                            case 5:
                                console.log("no device");
                                _b.label = 6;
                            case 6: return [2 /*return*/];
                        }
                    });
                });
            });
            return [2 /*return*/];
        });
    }); });
    //})
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