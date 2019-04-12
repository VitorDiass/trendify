import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../providers/base.service';

@Component({
    selector: 'baseLayout',
    templateUrl: './baseLayout.component.html',
    styleUrls: ['./baseLayout.component.scss']
})
export class BaseLayoutComponent implements OnInit {

    public aboutActive: boolean = false;
    public devicesActive : boolean = false;
    public baseService: BaseService;
    public deviceList: Array<any> = [];

    constructor(service: BaseService) {
        this.baseService = service;
    }

    ngOnInit() {
        this.fetchInfo();
        //this._ipcRendererSend();

    }

    fetchInfo() {
        this.getConnectedDevices();
    }

    getConnectedDevices() {
        this.baseService._ipcRendererSend("getConnectedDevices");
        this.baseService._ipcRendererOnce("getConnectedDevicesResp").then(devices => {
            if (devices && devices.response) {
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
                break;
            }
            case 'devices': {
                this.devicesActive = true;
                this.aboutActive = false;
                this.getConnectedDevices();
                break;
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
