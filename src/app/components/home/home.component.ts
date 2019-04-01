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

  constructor(service : ElectronService) { 
    this.ipcRenderer = service.ipcRenderer;

  }

  ngOnInit() {
    this._ipcRendererOn();
    this._ipcRendererSend();
  }

  _ipcRendererOn(){
    this.ipcRenderer.on('asynchronous-reply', (event,arg) => {
      console.log(event,arg);
    })
  }

  _ipcRendererSend(){
    const reply = this.ipcRenderer.sendSync("syncMessage","GetDeviceList");
    console.log(reply);
    this.deviceList.push(reply);
  }


}
