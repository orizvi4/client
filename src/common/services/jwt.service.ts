import axios from "axios";
import { Constants } from "../constants";
import { Subject, Subscription, timer } from "rxjs";
import { Injectable } from "@angular/core";
import { UserDTO } from "../models/userDTO.interface";
import { RequestService } from "./request.service";

@Injectable()
export class JwtService {

    localStorageChange$: Subject<void> = new Subject<void>();
    tempLocalStorage: UserDTO = this.getLocalStorage();
    localStorageSubscribe: Subscription = this.localStorageChange$.subscribe(async () => {
        await this.requestService.localStorageStrike();
    });
    localStorageToken: boolean = false;

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
            userPrincipalName: localStorage.getItem('userPrincipalName') as string,
            givenName: localStorage.getItem('givenName') as string,
            sn: localStorage.getItem('sn') as string,
            whenCreated: "",
            group: "",
            isEdit: false
        };
    }

    public setLocalStorageToken(token: boolean) : void {
        this.localStorageToken = token;
    }

    public localStorageCheck(): void {
        setInterval(() => {
            if (JSON.stringify(this.getLocalStorage()) != JSON.stringify(this.tempLocalStorage)) {
                if (this.localStorageToken == true) {
                    this.localStorageChange$.next();
                }
                this.tempLocalStorage = this.getLocalStorage();
            }
        }, 3000);
    }

    public refreshAccessToken(): void {
        try {
            setInterval(async () => {
                if (localStorage.getItem("refreshToken") != null) {
                    this.localStorageToken = false;
                    localStorage.setItem('accessToken', (await axios.post(`${Constants.AUTH_SERVICE}/tokens/refresh`, { token: localStorage.getItem('refreshToken') }, { headers: { Authorization: `Bearer ${localStorage.getItem('refreshToken')}` } })).data);
                    this.tempLocalStorage = this.getLocalStorage();
                    this.localStorageToken = true;
                }
            }, 100000);
        }
        catch (err) {
            console.log(err);
        }
    }

    public async blackListToken(): Promise<void> {
        await axios.post(`${Constants.AUTH_SERVICE}/users/logout`, { accessToken: localStorage.getItem('accessToken'), refreshToken: localStorage.getItem('refreshToken') });
    }
}