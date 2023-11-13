import axios from "axios";
import { Constants } from "../constants";
import Cookies from "js-cookie";

export class JwtService {
    async verifyToken(): Promise<boolean> {
        return (await axios.get(`${Constants.AUTH_SERVICE}/tokens/verify`, { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } })).data;
    }
    async refreshAccessToken(): Promise<void> {
        Cookies.set('accessToken', (await axios.post(`${Constants.AUTH_SERVICE}/tokens/refresh`,{}, { headers: { Authorization: `Bearer ${Cookies.get('refreshToken')}` } })).data);
    }
    async blackListToken(): Promise<void> {
        await axios.post(`${Constants.AUTH_SERVICE}/users/logout`,{accessToken: Cookies.get('accessToken'), refreshToken: Cookies.get('refreshToken')}, { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } });
    }
}