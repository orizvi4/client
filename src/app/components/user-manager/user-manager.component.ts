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
  tempUser!: UserDTO;

  async ngOnInit(): Promise<void> {
    this.users = await this.requestService.getUsers();
    for (const user of this.users) {
      user.whenCreated = `${user.whenCreated.substring(6, 8)}-${user.whenCreated.substring(4, 6)}-${user.whenCreated.substring(0, 4)}`;
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
  updateUser(user: UserDTO) {

  }
  cancelEdit(user: UserDTO) {
    user.isEdit = false;
    user.givenName = this.tempUser.givenName;
    user.sn = this.tempUser.sn;
  }

  editToggle(user: UserDTO) {
    for (const user of this.users) {
      user.isEdit = false;
    }
    this.tempUser = { ...user };
    user.isEdit = true;
  }
}
