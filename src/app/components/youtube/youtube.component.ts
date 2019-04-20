import { Component, OnInit, Input } from '@angular/core';
import { BaseService } from '../../providers/base.service';

@Component({
  selector: 'youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss']
})
export class YoutubeComponent implements OnInit {


  constructor(public baseService : BaseService) {
      
  }

  ngOnInit() {

  }

  Download(){
      this.baseService._ipcRendererSend("download","https://www.youtube.com/watch?v=IGQBtbKSVhY");
      this.baseService._ipcRendererOn("downloadCompleted").then( resp => {
          console.log(resp);
      })
  }

}
