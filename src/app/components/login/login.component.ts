import { Component, ElementRef, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from 'src/common/models/userDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private requestService: RequestService, private router: Router) { }
  @ViewChild('username') username!: ElementRef;
  @ViewChild('password') password!: ElementRef;
  @Output() userUpdate = new EventEmitter<UserDTO>();

  async ngOnInit() {
    const res = await this.requestService.authenticateUser('ori', 'Turhmch123');
    this.userUpdate.emit(res as UserDTO);
    this.router.navigate(['/userManager'], { state: { user: res } });
  }

  async authenticateUser() {
    try {
      const res = await this.requestService.authenticateUser(this.username.nativeElement.value, this.password.nativeElement.value);
      if (res != 'fail') {
        await Swal.fire({
          title: "login successful",
          text: `welcome ${this.username.nativeElement.value}`,
          icon: "success",
        });
        const res = await this.requestService.authenticateUser('ori', 'Turhmch123');
        this.userUpdate.emit(res as UserDTO);
        this.router.navigate(['/live'], { state: { user: res } });
      }
      else {
        await Swal.fire({
          title: "login error",
          text: 'username or password incorrect',
          icon: "error",
        });
      }
    }
    catch (err) {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'server error'
      });
    }
  }

}
