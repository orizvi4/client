import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { UserDTO } from 'src/common/models/userDTO.interface';
import { JwtService } from 'src/common/services/jwt.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  constructor() {}
  @Input() user!: UserDTO;
  @Output() signOut = new EventEmitter<void>();

  async signOutFunc() {
    const res = await Swal.fire({
      title: "log out",
      text: "are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'log out',
      background: "#101416",
      color: "white",
    });
    if (res.isConfirmed) {
      this.signOut.emit();
    }
  }
}
