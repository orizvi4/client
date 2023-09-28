import { Component, OnInit } from '@angular/core';
import { UserDTO } from 'src/common/models/userDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import swal from 'sweetalert';


@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit {
  constructor(private requestService: RequestService) { }
  users!: UserDTO[];
  tempUser: UserDTO | null | undefined = undefined;

  formatDate(date: string) {
    return `${date.substring(6, 8)}-${date.substring(4, 6)}-${date.substring(0, 4)}`;
  }

  async ngOnInit(): Promise<void> {
    this.users = await this.requestService.getUsers();
    for (const user of this.users) {
      user.whenCreated = this.formatDate(user.whenCreated);
    }
  }
  async deleteUser(user: UserDTO): Promise<void> {
    const del = await swal({
      title: "Are you sure?",
      text: "Your will not be able to recover this user",
      icon: "warning",
      buttons: {
        cancel: {
          value: false,
          visible: true
        },
        confirm: {
          text: "delete"
        }
      },
    });
    if (del) {
      console.log(await this.requestService.deleteUser(user.givenName));
      this.users.splice(this.users.indexOf(user), 1);

    }
  }
  cancelEdit(user: UserDTO) {
    if (this.tempUser != null) {
      user.isEdit = false;
      user.givenName = this.tempUser.givenName;
      user.sn = this.tempUser.sn;
    }
    else {
      this.users.pop();
      this.tempUser = undefined;
    }
  }
  async updateUser(user: UserDTO) {
    if (this.tempUser == null) { //new user
      this.tempUser = await this.requestService.addUser(user);
      this.tempUser.whenCreated = this.formatDate(this.tempUser.whenCreated);
      this.users.pop();
      this.users.push(this.tempUser);
    }
    else {

    }
  }
  async createUser() {
    if (this.tempUser === undefined || this.tempUser != null) {
      for (const user of this.users) {
        user.isEdit = false;
      }
      this.tempUser = null;
      const us: UserDTO = {userPrincipalName: "", givenName: "", sn: "", whenCreated: "", isEdit: true};
      this.users.push(us);
    }
  }

  editToggle(user: UserDTO) {
    for (const user of this.users) {
      user.isEdit = false;
    }
    this.tempUser = { ...user };
    user.isEdit = true;
  }
}
