import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, timer, takeUntil, Subscription } from 'rxjs';
import { Constants } from 'src/common/constants';
import { CustomJwtPayload } from 'src/common/models/customJwtPayload.class';
import { UserDTO } from 'src/common/models/userDTO.interface';
import { JwtService } from 'src/common/services/jwt.service';
import { RequestService } from 'src/common/services/request.service';
import { WebSocketService } from 'src/common/services/web-socket.service';
import Swal from 'sweetalert2';
import { ArchiveComponent } from './components/archive/archive.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  constructor(
    private requestService: RequestService,
    private router: Router,
    private jwtService: JwtService,
    private websocketService: WebSocketService,
    private toastr: ToastrService) {
  }

  sideNavStatus: boolean = false;
  user: UserDTO | null = null;
  timer$: Subject<void> = new Subject<void>();
  sub!: Subscription;

  public ngOnDestroy(): void {
    this.websocketService.closeSocket();
    this.sub.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    try {
      if (localStorage.length == 0 || !(await this.jwtService.verifyToken())) {
        this.user = null
        this.router.navigate(['login']);
      }
      else {
        this.timerReset();
        await this.updateUser(await this.requestService.getTokenUser());
        await this.jwtService.refreshAccessToken();
        this.jwtService.setLocalStorageToken(true);
        this.websocketService.connectToWebsocket();
        this.sub = this.websocketService.getRecordingDelete$().subscribe(async (recordingUrl: string) => {
          this.toastr.success("deleted recording successfuly", "", {
            positionClass: 'toast-bottom-right',
            timeOut: 3000,
          });
        });
      }
    }
    catch (err) {
      console.log(err);
      this.user = null
      localStorage.clear();
      this.router.navigate(['login']);
    }
  }

  timerReset() {
    console.log("resett");
    this.timer$.next();
    timer(Constants.SESSION_TIMEOUT).pipe(takeUntil(this.timer$)).subscribe(async () => {
      await this.signOut();
      await Swal.fire({
        icon: 'warning',
        title: 'logging out',
        text: 'you have been inactive for a while, please log in again',
        background: "#101416",
        color: "white",
      });
      this.router.navigate(['login']);
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
    this.router.navigate(['login']);
  }

  public async signOut(): Promise<void> {
    await this.requestService.roomRemoveUserAll(this.jwtService.decode().username as string);
    this.jwtService.setLocalStorageToken(false);
    await this.jwtService.blackListToken();
    localStorage.clear();
    this.timer$.next();
  }

}
