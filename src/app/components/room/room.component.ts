import { state } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChannelDTO } from 'src/common/models/channelDTO.interface';
import { RoomDTO } from 'src/common/models/roomDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  constructor(private router: Router, private requestService: RequestService) { }
  room: RoomDTO = {_id: "", channels: [], isRecording: false, name: ""};
  channels: ChannelDTO[] = [];

  async ngOnInit() {
    try {
      this.room = await this.requestService.getRoomById((history.state).roomId);
      this.channels = this.room.channels;
      for (const channel of this.channels) {
        this.requestService.connectChannel(channel._id);
      }
    }
    catch (err) {
      console.log(err);
      Swal.fire({
        title: 'server error',
        icon: 'error',
        text: "couldn't load cameras, try again later"
      });
    }
  }
  navigateToChannel(id: string) {
    this.router.navigate(['/live/room/channel'], { state: { id: id } });
  }
  async record() {
    try {
      if (this.room.isRecording == false) {
        await this.requestService.recordRoom((history.state).roomId, true);
      }
      else {
        await this.requestService.recordRoom((history.state).roomId, false);
      }
      this.room.isRecording = !this.room.isRecording;
      for (const channel of this.channels) {
        channel.isRecording = this.room.isRecording; 
      }
    }
    catch (err) {
      console.log(err);
      Swal.fire({
        title: 'server error',
        icon: 'error',
        text: "couldn't record cameras, try again later"
      });
    }
  }
}
