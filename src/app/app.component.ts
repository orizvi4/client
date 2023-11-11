import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Cookies from 'js-cookie';
import { UserDTO } from 'src/common/models/userDTO.interface';
import { JwtService } from 'src/common/services/jwt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router){}
  sideNavStatus: boolean = false;
  user: UserDTO | null = null;

  async signOut() {
    this.user = null;
    await JwtService.blackListToken();
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    this.router.navigate(['/login']);
  }
}
