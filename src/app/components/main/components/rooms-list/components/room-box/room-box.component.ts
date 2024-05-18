import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RoomDTO } from 'src/common/models/roomDTO.interface';
import { RequestService } from 'src/common/services/request.service';

@Component({
  selector: 'app-room-box',
  templateUrl: './room-box.component.html',
  styleUrls: ['./room-box.component.scss']
})
export class RoomBoxComponent implements OnInit {
  constructor(private domSani: DomSanitizer, private requestService: RequestService) { }

  @Input() room!: RoomDTO;
  urls: any[] = [];

  async ngOnInit(): Promise<void> {
    for (const channel of this.room.channels) {
      const base64String = await this.requestService.getChannelThumbnail(channel._id);
      this.urls.push(this.domSani.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String));
    }
  }

}
