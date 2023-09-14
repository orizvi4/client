import { state } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChannelDTO } from 'src/common/models/channelDTO.interface';
import { RequestService } from 'src/common/services/request.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  constructor(private router: Router, private requestService: RequestService) {}
  room: string = '';
  cameras: ChannelDTO[] = [];

  async ngOnInit() {
    this.cameras = (await this.requestService.getRoomById((history.state).roomId)).channels;
    this.room = (history.state).roomName;
    for (const camera of this.cameras) {
      this.requestService.connectChannel(camera._id);
    }
  }
  navigateToChannel(id: string) {
    this.router.navigate(['/live/room/channel'], {state: { id: id } });
  }
}
