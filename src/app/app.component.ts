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
        await this.updateUser(await this.requestService.getTokenUser());
        await this.jwtService.refreshAccessToken();
        this.jwtService.setLocalStorageToken(true);
      }
    }
    catch (err) {
      console.log("grgtr " + err);
      this.user = null
      localStorage.clear();
      this.router.navigate([{ outlets: { loginOutlet: ['login'] } }]);
    }
  }

  timerReset() {
    this.timer$.next();
    timer(Constants.SESSION_TIMEOUT).pipe(takeUntil(this.timer$)).subscribe(async () => {
      await this.signOut();
      await Swal.fire({
        icon: 'warning',
        title: 'logging out',
        text: 'you have been inactive for a while, please log in again'
      });
      window.location.reload();
    });
  }

  public async updateUser(user: UserDTO) {
    this.user = {
      group: await this.requestService.getUserGroup(user.givenName),
      givenName: user.givenName,
      mail: user.mail,
      sn: user.sn,
      isEdit: false,
      telephoneNumber: user.telephoneNumber,
    }
  }

  public async signOutEvent() {
    await this.signOut();
    window.location.reload();
  }

  public async signOut(): Promise<void> {
    this.jwtService.setLocalStorageToken(false);
    await this.jwtService.blackListToken();
    localStorage.clear();
    this.timer$.next();
  }
}
