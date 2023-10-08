import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from 'src/common/models/userDTO.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router){}
  sideNavStatus: boolean = false;
  user: UserDTO | null = null;

  signOut() {
    this.user = null;
    this.router.navigate(['/login']);
  }
}
