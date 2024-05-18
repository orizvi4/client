import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { JwtService } from 'src/common/services/jwt.service';
import { RequestService } from 'src/common/services/request.service';
import { WebSocketService } from 'src/common/services/web-socket.service';
import { RoomMessageDTO } from './models/roomMessageDTO.model';
import Swal from 'sweetalert2';
import { RoomInfoDTO } from './models/roomInfoDTO.interface';

@Component({
  selector: 'app-room-info',
  templateUrl: './room-info.component.html',
  styleUrls: ['./room-info.component.scss']
})
export class RoomInfoComponent implements OnInit, OnChanges {

  constructor(private requestService: RequestService,
    private websocketService: WebSocketService,
    private jwtService: JwtService) { }

  @Input() isRecording!: boolean;
  @Input() blockRoomText!: string;
  @Input() roomId!: string;
  @ViewChild('messageInput') messageInput!: ElementRef;
  roomInfo!: RoomInfoDTO;
  isBlocked!: boolean;

  public async ngOnInit(): Promise<void> {
    try {
      if (this.blockRoomText == 'Block room') {
        this.isBlocked = false;
      }
      else {
        this.isBlocked = true
      }
      
      this.roomInfo = await this.requestService.getRoomInfo(this.roomId);
      this.websocketService.getRoomInfo$().subscribe((info) => {
        this.roomInfo = info;
      });
    }
    catch (err) {
      console.log(err);
      Swal.fire({
        title: 'server error',
        icon: 'error',
        text: "couldn't load room info because of server error, try again later",
        background: "#101416",
        color: "white",
      });
    }
  }

  public async kickUser(username: string): Promise<void> {
    await this.requestService.kickUser(username);
    await this.requestService.roomRemoveUser(this.roomId, username);
  }

  public async sendMessage(): Promise<void> {
    try {
      await this.requestService.sendRoomMessage(this.roomId, {username: this.jwtService.decode().username as string, message: this.messageInput.nativeElement.value});
      this.messageInput.nativeElement.value = '';
    }
    catch (err) {
      console.log(err);
      Swal.fire({
        title: 'server error',
        icon: 'error',
        text: "couldn't send message because of server error, try again later",
        background: "#101416",
        color: "white",
      });
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["blockRoomText"].currentValue === 'Block room') {
      this.isBlocked = false;
    }
    else {
      this.isBlocked = true;
    }
  }
}
