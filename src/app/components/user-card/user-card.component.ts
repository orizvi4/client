import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserDTO } from 'src/common/models/userDTO.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() user!: UserDTO;
  @Output() signOut = new EventEmitter<boolean>();

  async signOutFunc() {
    // const res = await Swal.fire({
    //   title: "log out",
    //   text: "are you sure you want to log out?",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonText: 'log out'
    // });
    // if (res.isConfirmed) {
    //   this.signOut.emit();
    // }
    this.signOut.emit();
  }
}
