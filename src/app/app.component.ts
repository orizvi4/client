import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, timer } from 'rxjs';
import { Constants } from 'src/common/constants';
import { UserDTO } from 'src/common/models/userDTO.interface';
import { JwtService } from 'src/common/services/jwt.service';
import { RequestService } from 'src/common/services/request.service';
import { WebSocketService } from 'src/common/services/web-socket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private requestService: RequestService,
    private router: Router,
    private jwtService: JwtService,
    private websocket: WebSocketService) {
  }

  sideNavStatus: boolean = false;
  user: UserDTO | null = null;
  timer$: Subject<void> = new Subject<void>();

  async ngOnInit(): Promise<void> {
    try {
      if (localStorage.length == 0 || !(await this.jwtService.verifyToken())) {
        this.user = null
        this.router.navigate([{ outlets: { loginOutlet: ['login'] } }]);
      }
      else {
        this.updateUser(await this.requestService.getUserGroup(localStorage.getItem('givenName')as string));
        this.jwtService.setLocalStorageToken(true);
      }
    }
    catch (err) {
      this.user = null
      localStorage.clear();
      this.router.navigate([{ outlets: { loginOutlet: ['login'] } }]);
    }
  }

  timerReset() {
    this.timer$.next();
    timer(Constants.SESSION_TIMEOUT).pipe(takeUntil(this.timer$)).subscribe(async () => {
      await Swal.fire({
        icon: 'warning',
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
      mail: localStorage.getItem('mail') as string,
      sn: localStorage.getItem('sn') as string,
      isEdit: false,
      telephoneNumber: "",
    }
  }

  public async signOut() {
    this.jwtService.setLocalStorageToken(false);
    await this.jwtService.blackListToken();
    localStorage.clear();
    this.timer$.next();
    window.location.reload();
  }
}
