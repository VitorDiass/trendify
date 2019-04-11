import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public ipcRenderer;

  public deviceList : Array<any> = [];
  public url : string;
  public url1 : string;
  public message : any;

  constructor(service : ElectronService) { 
    this.ipcRenderer = service.ipcRenderer;

  }

  ngOnInit() {
    this.fetchInfo();
    //this._ipcRendererSend();

  }

  /**
   * _ipcRendererOn - to reveice a reply of an asynchronous message from the main process
   * @channel string used message identifier
   */

  _ipcRendererOn(channel : string) : Promise<any>{
    return new Promise((resolve,reject) => {
      this.ipcRenderer.on(channel, (event,arg) => {
        if(event && arg) {
          resolve({response : arg});
        }else{
          reject();
        }
      })
    })
  }

  _ipcRendererOnce(channel : string) : Promise<any>{
    return new Promise((resolve,reject) => {
      this.ipcRenderer.once(channel, (event,arg) => {
        if(event && arg) {
          resolve({response : arg});
        }else{
          reject();
        }
      })
    })
  }
  /**
   * _ipcRendererSend - Send an asynchronous message to the main process
   * @channel string used as a message identifier
   * @args optional values as arguments
   */

  _ipcRendererSend(channel : string, ...args){
      this.ipcRenderer.send(channel,...args);
  }

   /**
   * _ipcRendererSendSync - Send a synchronous message to the main process, blocking until gets the answer
   * @channel string used as a message identifier
   * @args optional values as arguments
   */

  _ipcRendererSendSync(channel : string ,...args){
    const reply = this.ipcRenderer.sendSync(channel,...args);
    return {res : reply};

  }

  getConnectedDevices(){
    this._ipcRendererSend("getConnectedDevices");
    this._ipcRendererOnce("getConnectedDevicesResp").then(devices => {
      if(devices && devices.response){
        this.deviceList = devices.response;
      }
    })
    .catch(error => {
      console.log(error);
    })
  }

  fetchInfo(){
    this.getConnectedDevices();
  }

    //send(url : string, url1 : string){
    //     if(url){
    //       this._ipcRendererSendSync(url,url1).then(res => {
    //         console.log(res);
    //       })
    //       }
    // }


}
