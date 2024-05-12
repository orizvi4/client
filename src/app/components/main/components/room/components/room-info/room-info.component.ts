import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RoomInfoDTO } from 'src/common/models/roomInfoDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import { WebSocketService } from 'src/common/services/web-socket.service';

@Component({
  selector: 'app-room-info',
  templateUrl: './room-info.component.html',
  styleUrls: ['./room-info.component.scss']
})
export class RoomInfoComponent implements OnInit, OnChanges {

  constructor(private requestService: RequestService,
    private websocketService: WebSocketService) { }

  @Input() isRecording!: boolean;
  @Input() blockRoomText!: string;
  @Input() roomId!: string;
  roomInfo!: RoomInfoDTO;
  isBlocked!: boolean;

  public async ngOnInit(): Promise<void> {
    if (this.blockRoomText == 'Block room') {
      this.isBlocked = false;
    }
    else {
      this.isBlocked = true
    }

    this.roomInfo = await this.requestService.getRoomInfo(this.roomId);
    this.websocketService.getRoomInfo$().subscribe((info) => {
      this.roomInfo = info;
    })
  }

  public async kickUser(username: string): Promise<void> {
    await this.requestService.kickUser(username);
    await this.requestService.roomRemoveUser(this.roomId, username);
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
