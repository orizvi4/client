import { Component, ElementRef, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AxiosError } from 'axios';
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
  @Output() userUpdate = new EventEmitter<string>();

  async ngOnInit(): Promise<void> {
    if (localStorage.length > 0) {
      try {
        this.userUpdate.emit(await this.requestService.getUserGroup(localStorage.getItem('givenName') as string));
        this.router.navigate(['/live']);
      }
      catch (err) {
        localStorage.clear();
      }
    }
  }


  async authenticateUser() {
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
        // await Swal.fire({
        //   title: "login successful",
        //   text: `welcome ${this.username.nativeElement.value}`,
        //   icon: "success",
        // });
        localStorage.setItem('accessToken', res.accessToken as string);
        localStorage.setItem('refreshToken', res.refreshToken as string);
        localStorage.setItem('userPrincipalName', res.userPrincipalName);
        localStorage.setItem('givenName', res.givenName);
        localStorage.setItem('sn', res.sn);
        this.userUpdate.emit(res.group);
        this.router.navigate(['/live']);
      }
      else {
        await Swal.fire({
          title: "login error",
          text: 'please fill the user and password',
          icon: "warning",
        });
      }
    }
    catch (err: any) {
      if (err.response == null || err.response.status == 500) {
        await Swal.fire({
          icon: 'error',
          title: 'server error'
        });
      }
      else {
        await Swal.fire({
          title: "login error",
          text: 'username or password incorrect',
          icon: "error",
        });
      }
    }
  }

}
