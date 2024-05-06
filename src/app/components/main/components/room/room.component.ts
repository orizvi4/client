import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelDTO } from 'src/common/models/channelDTO.interface';
import { RoomDTO } from 'src/common/models/roomDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import { WebSocketService } from 'src/common/services/web-socket.service';
import Swal from 'sweetalert2';
import { JwtService } from 'src/common/services/jwt.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  constructor(private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private websocketService: WebSocketService,
    private jwtService: JwtService
  ) {
    window.onbeforeunload = async (ev) => {
      await this.requestService.roomRemoveUser(this.room._id, this.jwtService.decode().username as string, this.group);
    }
  }

  showRoomInfo: boolean = false;
  room: RoomDTO = { _id: "", channels: [], isRecording: false, name: "" };
  channels: ChannelDTO[] = [];
  group: string = '';
  blockRoomText: string = 'Unblock room';

  async ngOnInit() {
    try {
      await new Promise<void>((resolve) => {
        this.route.queryParams.subscribe(async (params: any) => {
          this.room = await this.requestService.getRoomById(params.id);
          resolve();
        });
      });

      this.group = this.jwtService.decode().group as string;
      this.channels = this.room.channels;
      for (const channel of this.channels) {
        if (channel.isBlocked == false) {
          this.blockRoomText = 'Block room';
        }
        this.requestService.connectChannel(channel._id);
        this.websocketService.setMotionDetection(channel.device.title, channel.enableMotionDetection);
      }
      await this.requestService.roomAddUser(this.room._id, this.jwtService.decode().username as string, this.group);
    }
    catch (err) {
      console.log(err);
      Swal.fire({
        title: 'server error',
        icon: 'error',
        text: "couldn't load cameras, try again later",
        background: "#101416",
        color: "white",
      });
    }
  }

  public async toggleInfo(): Promise<void> {
    this.showRoomInfo = !this.showRoomInfo;
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
        await this.requestService.recordRoom(this.room._id, true);//אפשר ליפייף
      }
      else {
        await this.requestService.recordRoom(this.room._id, false);
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
        text: "couldn't record cameras, try again later",
        background: "#101416",
        color: "white",
      });
    }
  }

  public async ngOnDestroy(): Promise<void> {
    await this.requestService.roomRemoveUser(this.room._id, this.jwtService.decode().username as string, this.group);
  }
}
