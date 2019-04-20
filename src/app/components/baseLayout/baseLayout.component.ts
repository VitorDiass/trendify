import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseService } from '../../providers/base.service';
import { DevicesComponent } from '../devices/devices.component';

@Component({
    selector: 'baseLayout',
    templateUrl: './baseLayout.component.html',
    styleUrls: ['./baseLayout.component.scss']
})
export class BaseLayoutComponent implements OnInit {

    public aboutActive   : boolean = false;
    public devicesActive : boolean = false;
    public youtubeActive : boolean = false; 
    
    public deviceList: Array<any> = [];    

    constructor(public baseService: BaseService) {
        
    }

    ngOnInit() {
        this.fetchInfo();

    }

    fetchInfo() {
        this.getConnectedDevices();
    }

    getConnectedDevices() {
        this.baseService._ipcRendererSend("getConnectedDevices");
        this.baseService._ipcRendererOnce("getConnectedDevicesResp").then(devices => {
            if (devices && devices.response) {
                console.log(devices.response);
                this.deviceList = devices.response;
            }
        })
        .catch(error => {
                console.log(error);
            })
    }

    updateNavBar(nav: string) {
        switch (nav) {
            case 'about': {
                this.aboutActive = true;
                this.devicesActive = false;
                this.youtubeActive = false;
                break;
            }
            case 'devices': {
                this.devicesActive = true;
                this.aboutActive = false;
                this.youtubeActive = false;
                this.getConnectedDevices();
                break;
            }
            case 'youtube' : {
                this.devicesActive = false;
                this.aboutActive = false;
                this.youtubeActive = true;
            }
            default:
                break;
        }
    }



    //send(url : string, url1 : string){
    //     if(url){
    //       this._ipcRendererSendSync(url,url1).then(res => {
    //         console.log(res);
    //       })
    //       }
    // }


}
