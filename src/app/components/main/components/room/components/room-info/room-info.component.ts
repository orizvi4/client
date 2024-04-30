import { Component, OnInit } from '@angular/core';
import { RoomInfoDTO } from './models/roomInfoDTO.interface';
import { RequestService } from 'src/common/services/request.service';

@Component({
  selector: 'app-room-info',
  templateUrl: './room-info.component.html',
  styleUrls: ['./room-info.component.scss']
})
export class RoomInfoComponent implements OnInit {

  constructor(private requestService: RequestService) {}

  roomInfo!: RoomInfoDTO;

  public async ngOnInit(): |Promise<void> {
    this.roomInfo = await this.requestService.getRoomInfo((history.state).roomId);
  }
}
