import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RoomDTO } from 'src/common/models/roomDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import { Thumbnail } from './models/thumbnailDTO.interface';
import { thumbnailMode } from 'src/common/enums.model';
import { RoomInfoDTO } from '../../../room/components/room-info/models/roomInfoDTO.interface';

@Component({
  selector: 'app-room-box',
  templateUrl: './room-box.component.html',
  styleUrls: ['./room-box.component.scss']
})
export class RoomBoxComponent implements OnInit {
  constructor(private domSani: DomSanitizer, private requestService: RequestService) { }

  @Input() room!: RoomDTO;
  thumbnails: Thumbnail[] = [];
  urls: any[] = [];

  async ngOnInit(): Promise<void> {
    for (const channel of this.room.channels) {
      let url: SafeUrl | null = null;
      let mode: thumbnailMode = thumbnailMode.BLOCKED;
      if (channel.isBlocked === false) {
        try {
          const base64String = await this.requestService.getChannelThumbnail(channel._id);
          url = this.domSani.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String);
          mode = thumbnailMode.LIVE;
        }
        catch (err) {
          console.log(err);
        }
      }
      this.thumbnails.push({ mode: mode, url: url });
      if (this.thumbnails.length === 4) {
        break;
      }
    }
    const length: number = this.thumbnails.length;
    for (let i = 0; i < 4 - length; i++) {
      this.thumbnails.push({ mode: thumbnailMode.NONE, url: null });
    }
  }

}
