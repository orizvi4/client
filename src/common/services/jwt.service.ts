import axios from "axios";
import { Constants } from "../constants";
import { Subject, Subscription, timer } from "rxjs";
import { Injectable } from "@angular/core";
import { UserDTO } from "../models/userDTO.interface";
import { RequestService } from "./request.service";
import Swal from "sweetalert2";

@Injectable()
export class JwtService {

    localStorageChange$: Subject<void> = new Subject<void>();//emits the event
    tempLocalStorage: UserDTO = this.getLocalStorage();
    localStorageToken: boolean = false;//to check or not to check localstorage
    localStorageSubscribe: Subscription = this.localStorageChange$.subscribe(async () => {//handle the event
        await this.requestService.localStorageStrike(this.tempLocalStorage.accessToken as string);
        await this.blackListToken();
        this.setLocalStorageToken(false);
        localStorage.clear();
        await Swal.fire({
            title: "session error",
            text: "unauthorized activity detected, please login again",
            icon: "error",
        });
        window.location.reload();
    });

    constructor(private requestService: RequestService) {
        this.localStorageCheck();
        this.refreshAccessToken();
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

    public getLocalStorage(): UserDTO {
        return {
            accessToken: localStorage.getItem('accessToken') as string,
            refreshToken: localStorage.getItem('refreshToken') as string,
            mail: localStorage.getItem('mail') as string,
            givenName: localStorage.getItem('givenName') as string,
            sn: localStorage.getItem('sn') as string,
            telephoneNumber: "",
            group: "",
            isNew: false,
            isEdit: false
        };
    }

    public setLocalStorageToken(token: boolean): void {
        this.tempLocalStorage = this.getLocalStorage();
        this.localStorageToken = token;
    }

    public localStorageCheck(): void {
        setInterval(() => {
            if (JSON.stringify(this.getLocalStorage()) != JSON.stringify(this.tempLocalStorage)) {
                if (this.localStorageToken == true) {
                    this.localStorageChange$.next();
                }
                else {
                    this.tempLocalStorage = this.getLocalStorage();
                }
            }
        }, 3000);
    }

    public refreshAccessToken(): void {
        try {
            setInterval(async () => {
                if (localStorage.getItem("refreshToken") != null) {
                    this.setLocalStorageToken(false);
                    localStorage.setItem('accessToken', (await axios.post(`${Constants.AUTH_SERVICE}/tokens/refresh`, { token: localStorage.getItem('refreshToken') }, { headers: { Authorization: `Bearer ${localStorage.getItem('refreshToken')}` } })).data);
                    this.setLocalStorageToken(true);
                }
            }, 288000);
        }
        catch (err) {
            console.log(err);
        }
    }

    public async blackListToken(): Promise<void> {
        await axios.post(`${Constants.AUTH_SERVICE}/users/logout`, { accessToken: this.tempLocalStorage.accessToken, refreshToken: this.tempLocalStorage.refreshToken });
    }
}