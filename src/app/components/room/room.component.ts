import { state } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChannelDTO } from 'src/common/models/channelDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  constructor(private router: Router, private requestService: RequestService) { }
  room: string = '';
  channels: ChannelDTO[] = [];
  recording: boolean = false;

  async ngOnInit() {
    try {
      this.channels = (await this.requestService.getRoomById((history.state).roomId)).channels;
      this.room = (history.state).roomName;
      for (const camera of this.channels) {
        this.requestService.connectChannel(camera._id);
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
      this.recording = !this.recording;
      for (const channel of this.channels) {
        if (this.recording) {
          await this.requestService.startChannelRecording(channel._id);
        }
        else {
          await this.requestService.stopChannelRecording(channel._id);
        }
      }
    }
    catch (err) {
      console.log(err);
      this.recording = !this.recording;
      Swal.fire({
        title: 'server error',
        icon: 'error',
        text: "couldn't record cameras, try again later"
      });
    }
  }
}
