import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomDTO } from 'src/common/models/roomDTO.interface';
import { RequestService } from 'src/common/services/request.service';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.scss']
})
export class RoomsListComponent implements OnInit {
  constructor(private requestService: RequestService, private router: Router) {}
  @Input() sideNavStatus:boolean = false;
  rooms: RoomDTO[] = [];
  
  async ngOnInit() {
    this.rooms = await this.requestService.getAllRooms();
  }
  navigateToRoom(id: string, name: string) {
    this.router.navigate(['/room'], { state: { roomId: id, roomName: name } });
  }
}
