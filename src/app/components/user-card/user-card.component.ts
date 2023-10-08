import { Component, Input } from '@angular/core';
import { UserDTO } from 'src/common/models/userDTO.interface';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() user!: UserDTO;

}
