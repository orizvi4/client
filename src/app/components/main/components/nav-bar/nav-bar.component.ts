import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from 'src/common/models/userDTO.interface';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  constructor(private router: Router) {}
  @Output() sideNavToggled = new EventEmitter<boolean>();
  @Output() signOut = new EventEmitter<void>();
  @Input() sideNavStatus: boolean = false;
  @Input() user!: UserDTO;
  userPopUp: boolean = false;
  selectedPage: string = "live";

  ngOnInit(): void {
    this.selectedPage = this.router.url.substring(6);
  }

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
    this.selectedPage = place;
    this.router.navigate([`main/${place}`], {state: {group: this.user.group, givenName: this.user.givenName, sn: this.user.sn, mail: this.user.mail}});
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
