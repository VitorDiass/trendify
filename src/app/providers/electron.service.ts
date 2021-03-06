import { Injectable, Type } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
const promise = require('bluebird');
const youtube = require('ytdl-core');
import * as url from 'url';

@Injectable()
export class ElectronService {

  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  promise : typeof promise;
  youtube : typeof youtube;
  url : typeof url ;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.promise = window.require('bluebird');
      this.youtube = window.require('ytdl-core');
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.url = window.require('url');
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

}
