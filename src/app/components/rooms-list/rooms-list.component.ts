import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomDTO } from 'src/common/models/roomDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import Swal from 'sweetalert2';

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
    try {
      this.rooms = await this.requestService.getAllRooms();
    }
    catch(err) {
      Swal.fire({
        title: 'server error',
        icon: 'error',
        text: "couldn't load rooms, try again later"
      });
    }
  }
  navigateToRoom(id: string, name: string) {
    this.router.navigate(['/live/room'], { state: { roomId: id, roomName: name } });
  }
}
