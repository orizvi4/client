import axios from "axios";
import { Constants } from "../constants";
import { Subject, timer } from "rxjs";

export class JwtService {

    timer$ = new Subject();

    constructor() {
        this.refreshAccessToken();
    }

    // async verifyToken(): Promise<boolean> {
    //     return (await axios.get(`${Constants.AUTH_SERVICE}/tokens/verify`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    // }
    refreshAccessToken(): void {
        timer(20000).subscribe(async () => {
            localStorage.setItem('accessToken', (await axios.post(`${Constants.AUTH_SERVICE}/tokens/refresh`,{}, { headers: { Authorization: `Bearer ${localStorage.getItem('refreshToken')}` } })).data);
            this.refreshAccessToken();
        });
    }
    async blackListToken(): Promise<void> {
        await axios.post(`${Constants.AUTH_SERVICE}/users/logout`,{accessToken: localStorage.getItem('accessToken'), refreshToken: localStorage.getItem('refreshToken')}, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
    }
}