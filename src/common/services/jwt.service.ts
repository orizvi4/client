import axios from "axios";
import { Constants } from "../constants";
import { Subject, timer } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class JwtService {

    constructor() {
        this.refreshAccessToken();
    }

    async verifyToken(): Promise<boolean> {
        return (await axios.get(`${Constants.AUTH_SERVICE}/tokens/verify`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    async verifyManagerToken(): Promise<boolean> {
        return (await axios.get(`${Constants.AUTH_SERVICE}/tokens/verify/manager`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    async verifyEditorToken(): Promise<boolean> {
        return (await axios.get(`${Constants.AUTH_SERVICE}/tokens/verify/editor`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    refreshAccessToken(): void {
        try {
            setInterval(async () => {
                localStorage.setItem('accessToken', (await axios.post(`${Constants.AUTH_SERVICE}/tokens/refresh`, { username: localStorage.getItem('givenName') }, { headers: { Authorization: `Bearer ${localStorage.getItem('refreshToken')}` } })).data);
            }, 50000);
        }
        catch (err) {
            console.log(err);
        }
    }

    async blackListToken(): Promise<void> {
        await axios.post(`${Constants.AUTH_SERVICE}/users/logout`, { accessToken: localStorage.getItem('accessToken'), refreshToken: localStorage.getItem('refreshToken') });
    }
}