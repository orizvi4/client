import { Component, Input, OnInit } from '@angular/core';
import { RoomDTO } from 'src/common/models/roomDTO.interface';
import { RequestService } from 'src/common/services/request.service';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.scss']
})
export class RoomsListComponent implements OnInit {
  constructor(private requestService: RequestService) {}
  @Input() sideNavStatus:boolean = false;
  rooms: string[] = [];
  
  async ngOnInit() {
    const roomsList: RoomDTO[] = await this.requestService.getAllRooms();
    for (const room of roomsList) {
      this.rooms.push(room.name);
    }
  }
}
