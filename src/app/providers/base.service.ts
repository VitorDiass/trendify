import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';


@Injectable()
export class BaseService {

    ipcRenderer: typeof ipcRenderer;

    constructor() {
        // Conditional imports
        if (this.isElectron()) {
            this.ipcRenderer = window.require('electron').ipcRenderer;
        }
    }

    isElectron = () => {
        return window && window.process && window.process.type;
    }

    /**
     * _ipcRendererOn - to reveice a reply of an asynchronous message from the main process
     * @param {channel} string message identifier
     */

    _ipcRendererOn(channel: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ipcRenderer.on(channel, (event, arg) => {
                if (event && arg) {
                    resolve({ response: arg });
                } else {
                    reject();
                }
            })
        })
    }

    /**
    * _ipcRendererOnce - to reveice a reply of an asynchronous message from the main process (only listen once)
    * @param {channel} string message identifier
    */

    _ipcRendererOnce(channel: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ipcRenderer.once(channel, (event, arg) => {
                if (event && arg) {
                    resolve({ response: arg });
                } else {
                    reject();
                }
            })
        })
    }

    /**
    * _ipcRendererSend - Send an asynchronous message to the main process
    * @param {channel} string used as a message identifier
    * @param {args} any optional values as arguments
    */

    _ipcRendererSend(channel: string, ...args) {
        this.ipcRenderer.send(channel, ...args);
    }

    /**
       * _ipcRendererSendSync - Send a synchronous message to the main process, blocking until gets the answer
       * @param {channel} string used as a message identifier
       * @param {args} any optional values as arguments
       */

    _ipcRendererSendSync(channel: string, ...args) {
        const reply = this.ipcRenderer.sendSync(channel, ...args);
        return { res: reply };

    }




}
