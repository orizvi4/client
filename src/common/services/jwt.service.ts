import axios from "axios";
import { Constants } from "../constants";
import { Subject, Subscription, timer } from "rxjs";
import { Injectable } from "@angular/core";
import { UserDTO } from "../models/userDTO.interface";
import { RequestService } from "./request.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Injectable()
export class JwtService {

    refreshToken: string = '';

    localStorageChange$: Subject<void> = new Subject<void>();//emits the event
    tempAccessToken: string = localStorage.getItem('accessToken') as string;
    localStorageToken: boolean = false;//to check or not to check localstorage
    localStorageSubscribe: Subscription = this.localStorageChange$.subscribe(async () => {//handle the event
        await this.requestService.localStorageStrike(this.tempAccessToken as string);
        await this.blackListToken();
        this.setLocalStorageToken(false);
        localStorage.clear();
        await Swal.fire({
            title: "session error",
            text: "unauthorized activity detected, please login again",
            icon: "error",
            background: "#101416",
            color: "white",
        });
        this.router.navigate(['login']);
    });

    constructor(private requestService: RequestService, private router: Router) {
        this.localStorageCheck();
        this.refreshTokenInterval();
    }

    public async verifyUrl(): Promise<boolean> {
        return (await axios.post(`${Constants.AUTH_SERVICE}/tokens/verify/url`, { token: localStorage.getItem('accessToken') })).data;
    }

    public async verifyManagerUrl(): Promise<boolean> {
        return (await axios.post(`${Constants.AUTH_SERVICE}/tokens/verify/manager/url`, { token: localStorage.getItem('accessToken')})).data;
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


    public setLocalStorageToken(token: boolean): void {
        this.tempAccessToken = localStorage.getItem('accessToken') as string;
        this.localStorageToken = token;
    }

    public localStorageCheck(): void {
        setInterval(() => {
            if (localStorage.getItem('accessToken') as string != this.tempAccessToken) {
                if (this.localStorageToken == true) {
                    this.localStorageChange$.next();
                }
                else {
                    this.tempAccessToken = localStorage.getItem('accessToken') as string;
                }
            }
        }, 3000);
    }

    public setRefreshToken(refresh: string) {
        this.refreshToken = refresh;
    }

    public async refreshAccessToken(): Promise<void> {
        localStorage.setItem('accessToken', (await axios.post(`${Constants.AUTH_SERVICE}/tokens/refresh/access`, { token: this.refreshToken }, { headers: { Authorization: `Bearer ${this.refreshToken}` } })).data);
    }

    public async getRefreshToken(): Promise<string> {
        return (await axios.post(`${Constants.AUTH_SERVICE}/tokens/refresh/get`, {token: localStorage.getItem('accessToken')}, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    public refreshTokenInterval(): void {
        try {
            setInterval(async () => {
                if (this.refreshToken != '') {
                    this.setLocalStorageToken(false);
                    await this.refreshAccessToken();
                    this.setLocalStorageToken(true);
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