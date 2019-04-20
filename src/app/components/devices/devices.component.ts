import { Component, OnInit, Input } from '@angular/core';
import { BaseService } from '../../providers/base.service';

@Component({
  selector: 'devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  @Input() devices : Array<any>=[];
  public deviceId : string = null;

  constructor(public baseService : BaseService) {
      
  }

  ngOnInit() {

  }

  setConnectedDevice(id : string){
      if(id){
          console.log(id);
          this.baseService._ipcRendererSend("setConnectedDevice",id);
          this.baseService._ipcRendererOnce("setConnectedDeviceResp").then(deviceId => {
            this.deviceId = deviceId.response;
          })
      }
  }

}
