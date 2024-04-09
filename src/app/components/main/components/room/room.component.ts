import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChannelDTO } from 'src/common/models/channelDTO.interface';
import { RoomDTO } from 'src/common/models/roomDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import { WebSocketService } from 'src/common/services/web-socket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  constructor(private router: Router,
    private requestService: RequestService,
    private websocketService: WebSocketService
  ) {

  }

  room: RoomDTO = { _id: "", channels: [], isRecording: false, name: "" };
  channels: ChannelDTO[] = [];
  group: string = '';
  blockRoomText: string = 'Unblock room';

  async ngOnInit() {
    try {
      this.group = (history.state).group;
      this.room = await this.requestService.getRoomById((history.state).roomId);
      this.channels = this.room.channels;
      for (const channel of this.channels) {
        if (channel.isBlocked == false) {
          this.blockRoomText = 'Block room';
        }
        this.requestService.connectChannel(channel._id);
        this.websocketService.setMotionDetection(channel.device.title, channel.enableMotionDetection);
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

  public async setBlockRoom(): Promise<void> {
    if (this.blockRoomText === "Block room") {
      this.requestService.setRoomBlock(this.room._id, true);
      this.blockRoomText = "Unblock room";
      for (const channel of this.channels) {
        channel.isBlocked = true;
      }
    }
    else {
      this.requestService.setRoomBlock(this.room._id, false);
      this.blockRoomText = "Block room";
      for (const channel of this.channels) {
        channel.isBlocked = false;
      }
    }
  }

  public checkRoomBlock(): void {
    for (const channel of this.channels) {
      if (channel.isBlocked === false) {
        this.blockRoomText = "Block room";
        return;
      }
    }
    this.blockRoomText = "Unblock room"
  }

  public checkRoomRecord(id: string): void {
    for (const channel of this.channels) {
      if (channel._id === id.substring(9)) {
        channel.isRecording = !channel.isRecording;
      }
    }
    for (const channel of this.channels) {
      if (channel.isRecording === false) {
        this.room.isRecording = false;
        return;
      }
    }
    this.room.isRecording = true;
  }

  public async record() {
    try {
      if (this.room.isRecording == false) {
        await this.requestService.recordRoom((history.state).roomId, true);//אפשר ליפייף
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
