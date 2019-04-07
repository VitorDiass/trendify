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
    this._ipcRendererOn();
    //this._ipcRendererSend();
  }

  _ipcRendererOn(){
    this.ipcRenderer.on('asynchronous-reply', (event,arg) => {
      console.log(event,arg);
    })
  }

  async _ipcRendererSend(...args){
    const reply = await  this.ipcRenderer.sendSync("syncMessage",...args);
    return reply;   

  }

  async send(url : string, url1 : string){
      if(url){
        this._ipcRendererSend(url,url1).then(res => {
          console.log(res);
        })
        }
  }


}
