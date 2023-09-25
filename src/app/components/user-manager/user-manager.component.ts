import { Component, OnInit } from '@angular/core';
import { UserDTO } from 'src/common/models/userDTO.interface';
import { RequestService } from 'src/common/services/request.service';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit {
  constructor(private requestService: RequestService) { }
  users!: UserDTO[];

  async ngOnInit(): Promise<void> {
    this.users = await this.requestService.getUsers();
    for (const user of this.users) {
      user.whenCreated = `${user.whenCreated.substring(6, 8)}-${user.whenCreated.substring(4, 6)}-${user.whenCreated.substring(0, 4)}`;
    }
  }
  async deleteUser(user: UserDTO): Promise<void> {
    await this.requestService.deleteUser(user.givenName);
    this.users.splice(this.users.indexOf(user));
  }
}
