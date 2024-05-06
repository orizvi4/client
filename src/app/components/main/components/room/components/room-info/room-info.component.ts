import { Component, Input, OnInit } from '@angular/core';
import { RoomInfoDTO } from 'src/common/models/roomInfoDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import { WebSocketService } from 'src/common/services/web-socket.service';

@Component({
  selector: 'app-room-info',
  templateUrl: './room-info.component.html',
  styleUrls: ['./room-info.component.scss']
})
export class RoomInfoComponent implements OnInit {

  constructor(private requestService: RequestService,
    private websocketService: WebSocketService) {}

  @Input() roomId!: string;
  roomInfo!: RoomInfoDTO;

  public async ngOnInit(): Promise<void> {
    this.roomInfo = await this.requestService.getRoomInfo(this.roomId);
    this.websocketService.getRoomInfo$().subscribe((info) => {
      this.roomInfo = info;
    })
  }
}
