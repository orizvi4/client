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
  tempUser: UserDTO | null = null;

  formatDate(date: string) {
    return `${date.substring(6, 8)}-${date.substring(4, 6)}-${date.substring(0, 4)}`;
  }

  async ngOnInit(): Promise<void> {
    this.users = await this.requestService.getUsers();
    for (const user of this.users) {
      user.whenCreated = this.formatDate(user.whenCreated);
      user.group = await this.requestService.getUserGroup(user.givenName);
    }
  }
  async deleteUser(user: UserDTO): Promise<void> {
    try {
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
        const res = await this.requestService.deleteUser(user.givenName);
        if (res == 'success') {
          this.users.splice(this.users.indexOf(user), 1);
        }
        else {
          await swal({
            title: "couldn't delete user",
            icon: "error",
          });
        }
      }
    }
    catch (err) {
      console.log(err);
      await swal({
        title: "a server error has occured",
        icon: "error",
      });
    }
  }
  cancelEdit(user: UserDTO) {
    if (this.tempUser != null && this.tempUser.givenName != '') {
      user.isEdit = false;
      user.givenName = this.tempUser.givenName;
      user.sn = this.tempUser.sn;
      user.group = this.tempUser.group;
    }
    else {
      this.users.pop();
      this.tempUser = null;
    }
  }
  async updateUser(user: UserDTO) {
    if (this.tempUser != null && this.tempUser.givenName != '' && this.tempUser.sn != '') {
      try {
        if (this.tempUser != null && this.tempUser.whenCreated == '') { //new user exist
          this.tempUser = await this.requestService.addUser(user);
          if (this.tempUser) {
            this.tempUser.whenCreated = this.formatDate(this.tempUser.whenCreated);
            this.users.pop();
            this.users.push(this.tempUser);
            this.tempUser = null;
          }
          else {
            await swal({
              title: "couldn't create a new user",
              icon: "error",
            });
          }
        }
        else {
          const whenCreated: string = this.tempUser.whenCreated;
          this.tempUser = await this.requestService.modifyUser(this.tempUser.givenName, user);
          if (this.tempUser) {
            this.tempUser.whenCreated = whenCreated;
            this.users.splice(this.users.indexOf(user), 1);
            this.users.push(this.tempUser);
            this.tempUser = null;
          }
          else {
            await swal({
              title: "couldn't update user",
              icon: "error",
            });
          }
        }
      }
      catch (err) {
        console.log(err);
        await swal({
          title: "a server error has occured",
          icon: "error",
        });
      }
    }
    else if (this.tempUser != null) {
      await swal({
        title: "please fill the name of the user",
        icon: "error",
      });
    }
  }
  
  async createUser() {
    if (this.tempUser === null) {
      for (const user of this.users) {
        user.isEdit = false;
      }
      this.tempUser = { group: "users", userPrincipalName: "", givenName: "", sn: "", whenCreated: "", isEdit: true };
      this.users.push(this.tempUser);
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
