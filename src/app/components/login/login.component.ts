import { Component, ElementRef, EventEmitter, Output, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AxiosError } from 'axios';
import { AppComponent } from 'src/app/app.component';
import { UserDTO } from 'src/common/models/userDTO.interface';
import { JwtService } from 'src/common/services/jwt.service';
import { RequestService } from 'src/common/services/request.service';
import Swal from 'sweetalert2';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private requestService: RequestService,
    private router: Router,
    private jwtService: JwtService,
    private mainComponent: MainComponent) { }
  @ViewChild('username') username!: ElementRef;
  @ViewChild('password') password!: ElementRef;



  public async authenticateUser() {
    try {
      if (this.username.nativeElement.value.length > 0 && this.password.nativeElement.value.length > 0) {
        const res: UserDTO = await this.requestService.authenticateUser(this.username.nativeElement.value, this.password.nativeElement.value);

        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          text: "Signed in successfully"
        });
        localStorage.setItem('accessToken', res.accessToken as string);
        this.router.navigate(['main']);
      }
      else {
        await Swal.fire({
          title: "login error",
          text: 'please fill the user and password',
          icon: "warning",
          background: "#101416",
          color: "white",
        });
      }
    }
    catch (err: any) {
      if (err.response != null && err.response.status == 500) {
        await Swal.fire({
          icon: 'error',
          title: 'server error',
          background: "#101416",
          color: "white",
        });
      }
      else if (err.response != null && err.response.status == 401) {
        await Swal.fire({
          title: "login error",
          text: "unauthorized login, user is blocked. please talk to a system manager",
          icon: "error",
          background: "#101416",
          color: "white",
        });
      }
      else if (err.response != null && err.response.status == 400) {
        await Swal.fire({
          title: "login error",
          text: 'username or password incorrect',
          icon: "error",
          background: "#101416",
          color: "white",
        });
      }
      else {
        await Swal.fire({
          icon: 'error',
          title: 'server error',
          background: "#101416",
          color: "white",
        });
      }
    }
  }

}
