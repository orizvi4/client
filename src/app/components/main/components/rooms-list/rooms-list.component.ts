import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoomDTO } from 'src/common/models/roomDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.scss']
})
export class RoomsListComponent implements OnInit {
  constructor(private requestService: RequestService,
    private router: Router, private toastr: ToastrService) { }
  @Input() sideNavStatus: boolean = false;
  rooms: RoomDTO[] = [];

  async ngOnInit() {
    try {
      this.rooms = await this.requestService.getAllRooms();
    }
    catch (err) {
      console.log(err);
      this.toastr.error("couldn't load rooms, try again later", "", {
        positionClass: 'toast-bottom-right',
        timeOut: 4000,
      });
    }
  }

  navigateToRoom(id: string, name: string) {
    this.router.navigate([`main/live/room`], { queryParams: { id: id } });
  }
}
