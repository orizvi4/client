import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from 'src/common/models/userDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private requestService: RequestService, private router: Router) {}
  @ViewChild('username') username!: ElementRef;
  @ViewChild('password') password!: ElementRef;
  @Output() userUpdate = new EventEmitter<UserDTO>();

  async authenticateUser() {
    const res = await this.requestService.authenticateUser(this.username.nativeElement.value, this.password.nativeElement.value);
    if (res) {
      // const user: string = await this.requestService.getUserGroup(this.username.nativeElement.value);
      await swal({
        title: "login successful",
        text: `welcome ${this.username.nativeElement.value}`,
        icon: "success",
      });
      this.userUpdate.emit(res);
      this.router.navigate(['/live'], { state: { user: res } });
    }
    else {
      await swal({
        title: "login error",
        text: 'username or password incorrect',
        icon: "error",
      });
    }
  }

}
