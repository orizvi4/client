import { Component, OnInit } from '@angular/core';
import { AxiosError } from 'axios';
import { UserDTO } from 'src/common/models/userDTO.interface';
import { JwtService } from 'src/common/services/jwt.service';
import { RequestService } from 'src/common/services/request.service';
import swal from 'sweetalert';
import Swal from 'sweetalert2';


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
    try {
      this.users = await this.requestService.getUsers();
      for (const user of this.users) {
        user.whenCreated = this.formatDate(user.whenCreated);
        user.group = await this.requestService.getUserGroup(user.givenName);
      }
    }
    catch (err: any) {//make a client session verify and logout
      if ((err as AxiosError).response?.status == 401) {
        await Swal.fire({
          icon: 'error',
          title: 'access denied',
          text: "session has timed out, please log in again"
        });
        await JwtService.refreshAccessToken();
        this.ngOnInit();
      }
      else {
        await Swal.fire({
          icon: 'error',
          title: 'server error',
          text: "couldn't load users, please try again later"
        });
      }
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
        await this.requestService.deleteUser(user.givenName);
        this.users.splice(this.users.indexOf(user), 1);
      }
    }
    catch (err) {
      console.log(err);
      if ((err as AxiosError).response?.status == 401) {
        await Swal.fire({
          icon: 'error',
          title: 'access denied',
          text: "session has timed out, please log in again"
        });
        await JwtService.refreshAccessToken();
        this.deleteUser(user);
      }
      else {
        await Swal.fire({
          icon: 'error',
          title: 'delete user error',
          text: "a server error has occured, please try again later"
        });
      }
    }
  }
  cancelEdit(user: UserDTO) {
    if (this.tempUser != null && this.tempUser.whenCreated != '') {
      user.isEdit = false;
      user.givenName = this.tempUser.givenName;
      user.sn = this.tempUser.sn;
      user.group = this.tempUser.group;
    }
    else {
      this.users.pop();
    }
    this.tempUser = null;
  }
  async updateUser(user: UserDTO) {
    if (this.tempUser != null && this.tempUser.givenName != '' && this.tempUser.sn != '') {
      try {
        if (this.tempUser != null && this.tempUser.whenCreated == '') { //new user exist
          const res: UserDTO = await this.requestService.addUser(user)
          this.tempUser = res as UserDTO;
          this.tempUser.whenCreated = this.formatDate(this.tempUser.whenCreated);
          this.users.pop();
          this.users.push(this.tempUser);
          this.tempUser = null;
        }
        else {
          const whenCreated: string = this.tempUser.whenCreated;
          this.tempUser = await this.requestService.modifyUser(this.tempUser.givenName, user);

          this.tempUser.whenCreated = whenCreated;
          this.users.splice(this.users.indexOf(user), 1);
          this.users.push(this.tempUser);
          this.tempUser = null;
        }
      }
      catch (err: any) {
        console.log(err);
        if (err.response.status == 403) {
          await swal({
            title: "couldn't create a new user",
            text: "the name of the user isn't correct or already exist",
            icon: "error",
          });
        }
        else if (err.response.status == 400) {
          await Swal.fire({
            icon: 'error',
            title: 'modify user error',
            text: "user name already exist, please try another name"
          });
        }
        else if ((err as AxiosError).response?.status == 401) {
          await Swal.fire({
            icon: 'error',
            title: 'access denied',
            text: "session has timed out, please log in again"
          });
          await JwtService.refreshAccessToken();
          this.updateUser(user);
        }
        else {
          await Swal.fire({
            icon: 'error',
            title: 'server error',
            text: "please try again later"
          });
        }
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
    try {
      if (this.tempUser === null) {
        for (const user of this.users) {
          user.isEdit = false;
        }
        this.tempUser = { group: "users", userPrincipalName: "", givenName: "", sn: "", whenCreated: "", isEdit: true };
        this.users.push(this.tempUser);
      }
      else {
        await swal({
          title: "please finish updating current user",
          icon: "warning",
        });
      }
    }
    catch (err) {
      if ((err as AxiosError).response?.status == 401) {
        await Swal.fire({
          icon: 'error',
          title: 'access denied',
          text: "session has timed out, please log in again"
        });
        await JwtService.refreshAccessToken();
        this.createUser();
      }
      else {
        await Swal.fire({
          icon: 'error',
          title: 'server error',
          text: "please try again later"
        });
      }
    }
  }

  async editToggle(user: UserDTO) {
    if (this.tempUser == null) {
      for (const user of this.users) {
        user.isEdit = false;
      }
      this.tempUser = { ...user };
      user.isEdit = true;
    }
    else {
      await swal({
        title: "please finish updating current user",
        icon: "warning",
      });
    }
  }
}
