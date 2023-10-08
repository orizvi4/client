import { Component } from '@angular/core';
import { UserDTO } from 'src/common/models/userDTO.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sideNavStatus: boolean = false;
  //   authority: string = '';
  user!: UserDTO;
}
