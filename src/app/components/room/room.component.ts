import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelDTO } from 'src/common/models/channelDTO.interface';
import { RequestService } from 'src/common/services/request.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  constructor(private router: ActivatedRoute, private requestService: RequestService) {}
  cameras: ChannelDTO[] = [];

  async ngOnInit() {
    this.cameras = (await this.requestService.getRoomById((history.state).roomId)).channels;
  }
}
