import axios from "axios";
import { Constants } from "../constants";
import { Subject, Subscription, timer } from "rxjs";
import { Injectable } from "@angular/core";
import { UserDTO } from "../models/userDTO.interface";
import { RequestService } from "./request.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { CustomJwtPayload } from "../models/customJwtPayload.class";
import { jwtDecode } from "jwt-decode";

@Injectable()
export class JwtService {
    constructor(private requestService: RequestService,
        private router: Router,) {
        this.refreshTokenInterval();
        addEventListener('storage', async (event) => {
            if (this.localStorageToken == true) {
                localStorage.setItem('accessToken' ,(event.oldValue as string));
                await this.requestService.roomRemoveUserAll(this.decode().username as string);
                await this.requestService.localStorageStrike(event.oldValue as string);
                await this.blackListToken();
                localStorage.clear();
                await Swal.fire({
                    title: "session error",
                    text: "unauthorized activity detected, please login again",
                    icon: "error",
                    background: "#101416",
                    color: "white",
                });
                this.router.navigate(['login']);
            }
        });
    }

    refreshToken: string = '';
    localStorageToken: boolean = false;

    public setLocalStorageToken(token: boolean): void {
        this.localStorageToken = token;
    }

    public async verifyUrl(): Promise<boolean> {
        return (await axios.post(`${Constants.AUTH_SERVICE}/tokens/verify/url`, { token: localStorage.getItem('accessToken') })).data;
    }

    public async verifyManagerUrl(): Promise<boolean> {
        return (await axios.post(`${Constants.AUTH_SERVICE}/tokens/verify/manager/url`, { token: localStorage.getItem('accessToken') })).data;
    }

    public async verifyToken(): Promise<boolean> {
        return (await axios.get(`${Constants.AUTH_SERVICE}/tokens/verify`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    public async verifyManagerToken(): Promise<boolean> {
        return (await axios.get(`${Constants.AUTH_SERVICE}/tokens/verify/manager`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    public async verifyEditorToken(): Promise<boolean> {
        return (await axios.get(`${Constants.AUTH_SERVICE}/tokens/verify/editor`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    public decode(): CustomJwtPayload {
        try {
            return jwtDecode(localStorage.getItem('accessToken') as string);
        }
        catch (err) {
            console.log(err);
            return { username: null };
        }
    }

    public setRefreshToken(refresh: string) {
        this.refreshToken = refresh;
    }

    public async refreshAccessToken(): Promise<void> {
        localStorage.setItem('accessToken', (await axios.post(`${Constants.AUTH_SERVICE}/tokens/refresh/access`, { token: this.refreshToken }, { headers: { Authorization: `Bearer ${this.refreshToken}` } })).data);
    }

    public async getRefreshToken(): Promise<string> {
        return (await axios.post(`${Constants.AUTH_SERVICE}/tokens/refresh/get`, { token: localStorage.getItem('accessToken') }, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    public refreshTokenInterval(): void {
        try {
            setInterval(async () => {
                if (this.refreshToken != '') {
                    await this.refreshAccessToken();
                }
            }, 288000);
        }
        catch (err) {
            console.log(err);
        }
    }

    public async blackListToken(): Promise<void> {
        await axios.post(`${Constants.AUTH_SERVICE}/users/logout`, { accessToken: localStorage.getItem('accessToken') as string, refreshToken: this.refreshToken });
        this.refreshToken = '';
    }
}