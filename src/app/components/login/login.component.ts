import { Component, ElementRef, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AxiosError } from 'axios';
import { UserDTO } from 'src/common/models/userDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private requestService: RequestService, private router: Router) { }
  @ViewChild('username') username!: ElementRef;
  @ViewChild('password') password!: ElementRef;
  @Output() userUpdate = new EventEmitter<void>();

  ngOnInit(): void {
    if (localStorage.length > 0){
      this.userUpdate.emit();
      this.router.navigate(['/live']);
    }
  }

  // async ngOnInit() {
  //   const res: UserDTO = {
  //     givenName: "ori",
  //     isEdit: false,
  //     sn: 'zvi',
  //     group: 'managers',
  //     userPrincipalName: 'ori@orizvi.test',
  //     whenCreated: '02032004'
  //   };
  //   this.userUpdate.emit(res as UserDTO);
  //   this.router.navigate(['/live'], { state: { user: res } });
  // }

  async authenticateUser() {
    try {
      const res: UserDTO = await this.requestService.authenticateUser(this.username.nativeElement.value, this.password.nativeElement.value);
      await Swal.fire({
        title: "login successful",
        text: `welcome ${this.username.nativeElement.value}`,
        icon: "success",
      });
      Cookies.set('accessToken', res.accessToken as string, {expires: 7});
      Cookies.set('refreshToken', res.refreshToken as string, {expires: 7});
      localStorage.setItem('userPrincipalName', res.userPrincipalName);
      localStorage.setItem('givenName', res.givenName);
      localStorage.setItem('group', res.group);
      localStorage.setItem('sn', res.sn);
      this.userUpdate.emit();
      this.router.navigate(['/live']);
    }
    catch (err: any) {
      if (err.response.status == 500) {
        Swal.fire({
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
