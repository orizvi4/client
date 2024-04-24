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
  constructor(private requestService: RequestService, private jwtService: JwtService) { }
  users!: UserDTO[];
  tempUser: UserDTO | null = null;
  childUser: UserDTO | null = null;

  public formatDate(date: string) {
    return `${date.substring(6, 8)}-${date.substring(4, 6)}-${date.substring(0, 4)}`;
  }

  async ngOnInit(): Promise<void> {
    await this.updateAllUsers();
  }

  public openUserStrike(username: string) {
    for (const user of this.users) {
      if (user.givenName == username) {
        this.childUser = user;
      }
    }
  }

  public async setUserBlock(username: string, isBlocked: boolean): Promise<void> {
    try {
      await this.requestService.setUserBlock(username, isBlocked);
      for (let i: number = 0; i < this.users.length; i++) {
        if (this.users[i].givenName == username) {
          this.users[i].isBlocked = isBlocked;
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  public async updateAllUsers() {
    try {
      this.users = await this.requestService.getUsers(history.state.givenName);
      for (const user of this.users) {;
        user.group = await this.requestService.getUserGroup(user.givenName);
        user.isBlocked = await this.requestService.isUserBlocked(user.givenName);
      }
    }
    catch (err: any) {
      if ((err as AxiosError).response?.status == 401) {
        await Swal.fire({
          icon: 'error',
          title: 'access denied',
          text: "session has timed out, please log in again",
          background: "#101416",
          color: "white",
        });
      }
      else {
        await Swal.fire({
          icon: 'error',
          title: 'server error',
          text: "couldn't load users, please try again later",
          background: "#101416",
          color: "white",
        });
      }
    }
  }

  public async deleteUser(user: UserDTO): Promise<void> {
    try {
      const del = await Swal.fire({
        title: "Are you sure?",
        text: "Your will not be able to recover this user",
        icon: "warning",
        background: "#101416",
        color: "white",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      });
      if (del.isConfirmed) {
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
          text: "session has timed out, please log in again",
          background: "#101416",
          color: "white",
        });
      }
      else {
        await Swal.fire({
          icon: 'error',
          title: 'delete user error',
          text: "a server error has occured, please try again later",
          background: "#101416",
          color: "white",
        });
      }
    }
  }

  public cancelEdit(user: UserDTO) {
    if (this.tempUser != null && this.tempUser.isNew == false) {
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
  
  public async updateUser(user: UserDTO) {
    if (this.tempUser != null && this.tempUser.givenName != '' && this.tempUser.sn != '') {
      try {
        if (this.tempUser != null && this.tempUser.isNew == true) { //new user
          const res: UserDTO = await this.requestService.addUser(user)
          this.tempUser = res as UserDTO;
          this.users.pop();
          this.users.push(this.tempUser);
          this.tempUser = null;
        }
        else { //existing user
          const newUser: UserDTO = await this.requestService.modifyUser(this.tempUser.givenName, user);
          this.tempUser = null;
          for (let i: number = 0; i < this.users.length; i++) {
            if (this.users[i].givenName == user.givenName) {
              this.users[i] = newUser;
            }
          }
        }
      }
      catch (err: any) {
        console.log(err);
        if (err.response.status == 403) {
          await swal({
            title: "couldn't create a new user",
            text: "unauthorized characters have been detected",
            icon: "error",
          });
        }
        else if (err.response.status == 400) {
          await Swal.fire({
            icon: 'error',
            title: 'modify user error',
            text: "user name already exist, please try another name",
            background: "#101416",
            color: "white",
          });
        }
        else if ((err as AxiosError).response?.status == 401) {
          await Swal.fire({
            icon: 'error',
            title: 'access denied',
            text: "session has timed out, please log in again",
            background: "#101416",
            color: "white",
          });
        }
        else {
          await Swal.fire({
            icon: 'error',
            title: 'server error',
            text: "please try again later",
            background: "#101416",
            color: "white",
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

  public async createUser() {
    try {
      if (this.tempUser === null) {
        for (const user of this.users) {
          user.isEdit = false;
          user.isNew = false;
        }
        this.tempUser = { group: "users", givenName: "", sn: "", mail: "", telephoneNumber: "", isNew: true, isEdit: true };
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
          text: "session has timed out, please log in again",
          background: "#101416",
          color: "white",
        });
      }
      else {
        await Swal.fire({
          icon: 'error',
          title: 'server error',
          text: "please try again later",
          background: "#101416",
          color: "white",
        });
      }
    }
  }

  async editToggle(user: UserDTO) {
    if (this.tempUser == null) {
      for (const user of this.users) {
        user.isEdit = false;
        user.isNew = false//check
      }
      this.tempUser = { ...user };
      user.isEdit = true;
      user.isNew = false;
    }
    else {
      await swal({
        title: "please finish updating current user",
        icon: "warning",
      });
    }
  }
}
