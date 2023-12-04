import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Cookies from 'js-cookie';
import { Subject, takeUntil, timer } from 'rxjs';
import { Constants } from 'src/common/constants';
import { UserDTO } from 'src/common/models/userDTO.interface';
import { JwtService } from 'src/common/services/jwt.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, private jwtService: JwtService) { 
    // this.user = {
    //   givenName: "ori",
    //   isEdit: false,
    //   sn: 'zvi',
    //   group: 'managers',
    //   userPrincipalName: 'ori@orizvi.test',
    //   whenCreated: '02032004'
    // };
  }

  sideNavStatus: boolean = false;
  user: UserDTO | null = null;
  timer$ = new Subject<void>();

  timerReset() {
    this.timer$.next();
    timer(Constants.SESSION_TIMEOUT).pipe(takeUntil(this.timer$)).subscribe(async () => {
      await Swal.fire({
        icon:'warning',
        title: 'logging out',
        text: 'you have been inactive for a while, please log in again'
      })
      this.signOut();
    });
  }

  updateUser(group: string) {
    this.user = {
      group: group,
      givenName: localStorage.getItem('givenName') as string,
      userPrincipalName: localStorage.getItem('userPrincipalName') as string,
      sn: localStorage.getItem('sn') as string,
      isEdit: false,
      whenCreated: ''
    }
  }

  async signOut() {
    this.timer$.next();
    this.user = null;
    await this.jwtService.blackListToken();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
