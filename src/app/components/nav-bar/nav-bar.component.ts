import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from 'src/common/models/userDTO.interface';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  constructor(private router: Router) {}
  @Output() sideNavToggled = new EventEmitter<boolean>();
  @Output() signOut = new EventEmitter<void>();
  menuStatus: boolean = false;
  userPopUp: boolean = false;
  @Input() user!: UserDTO;

  sideNavToggle() {
    this.menuStatus = !this.menuStatus;
    this.sideNavToggled.emit(this.menuStatus);
    this.userPopUp = false;
  }
  navigate(place: string) {
    this.router.navigate([`/${place}`], {state: {group: this.user.group}});
  }
  openUserMenu() {
    this.userPopUp = !this.userPopUp;
  }
  signOutFunc() {
    this.sideNavToggle();
    this.signOut.emit();
  }
}
