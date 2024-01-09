import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
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
  @Input() sideNavStatus: boolean = false;
  userPopUp: boolean = false;
  @Input() user!: UserDTO;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sideNavStatus']) {
      this.userPopUp = false;
    }
  }

  sideNavToggle() {
    if (this.userPopUp == false) {
      this.sideNavStatus = !this.sideNavStatus;
      this.sideNavToggled.emit(this.sideNavStatus);
    }
  }
  navigate(place: string) {
    this.router.navigate([`/${place}`], {state: {group: this.user.group}});
  }
  openUserMenu() {
    this.userPopUp = !this.userPopUp;
  }
  signOutFunc() {
    this.userPopUp = false;
    this.sideNavToggle();
    this.signOut.emit();
  }
}
