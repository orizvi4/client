import { ElementRef, Injectable } from "@angular/core";
import axios from "axios";
import { RoomDTO } from "../models/roomDTO.interface";
import { Constants } from "../constants";
import { ChannelDTO } from "../models/channelDTO.interface";
import { FilterDTO } from "../models/filterDTO.class";
import { RecordingDTO } from "../models/recordingDTO.interface";
import { RoomRecordingsDTO } from "../models/roomRecordingsDTO.interface";
import { UserDTO } from "../models/userDTO.interface";
import { StrikeDTO } from "src/app/components/main/components//user-manager/components/user-strike/models/strikeDTO.interface";

@Injectable()
export class RequestService {
    public async getAllChannels(): Promise<ChannelDTO[]> {
        return (await axios.get<ChannelDTO[]>(`${Constants.ROOM_HANDLER}/channel/all`, {headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }})).data;
    }

    public async getChannel(id: string): Promise<ChannelDTO> {
        return (await axios.get<ChannelDTO>(`${Constants.ROOM_HANDLER}/channel/id`, { params: { id: id }, headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    public async getAllRooms(): Promise<RoomDTO[]> {
        return (await axios.get<RoomDTO[]>(`${Constants.ROOM_HANDLER}/room/all`, { timeout: 2000, headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    public async recordRoom(id: string, record: boolean): Promise<string> {
        if (record) {
            return (await axios.get<string>(`${Constants.ROOM_HANDLER}/room/record/start`, { params: { id: id }, headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
        }
        else {
            return (await axios.get<string>(`${Constants.ROOM_HANDLER}/room/record/stop`, { params: { id: id }, headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
        }
    }

    public async getRoomById(id: string): Promise<RoomDTO> {
        return (await axios.get<RoomDTO>(`${Constants.ROOM_HANDLER}/room/id`, { params: { id: id }, headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    public async connectChannel(id: string): Promise<any> {
        return (await axios.put<string>(`${Constants.ROOM_HANDLER}/channel/connect?id=${id}`,{}, {headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }})).data;
    }

    public async getRecordings(filter: FilterDTO): Promise<RoomRecordingsDTO[]> {
        return (await axios.put<RoomRecordingsDTO[]>(`${Constants.ROOM_HANDLER}/recording`, filter, {headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }})).data;
    }

    public async saveRecording(file: ElementRef, start: string, end: string, channel: string) {
        let suffix;
        try {
            suffix = (await axios.get<number>(`${Constants.CONTENT_MANAGER}/file/suffix`, { params: { channel: channel }, headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
        }
        catch (err) {
            throw err;
        }
        const formData = new FormData();
        formData.append('file', file.nativeElement.files[0]);
        formData.append('startAt', start);
        formData.append('endAt', end);
        return (await axios.post<boolean>(`${Constants.CONTENT_MANAGER}/file/upload`, formData, { params: { channel: channel, suffix: suffix }, headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    public async isDateValid(start: string, end: string, channel: string): Promise<boolean> {
        return (await axios.post<boolean>(`${Constants.CONTENT_MANAGER}/file/date`, { startAt: start, endAt: end, channel: channel }, {headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }})).data;
    }

    public async deleteRecording(name: string): Promise<boolean> {
        return (await axios.delete<boolean>(`${Constants.CONTENT_MANAGER}/delete`, { params: { file: name }, headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    public async stopChannelRecording(id: string): Promise<string> {
        return (await axios.put<string>(`${Constants.ROOM_HANDLER}/channel/recorders/stop?id=${id}`, {}, {headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }})).data;
    }

    public async startChannelRecording(id: string): Promise<string> {
        return (await axios.post<string>(`${Constants.ROOM_HANDLER}/channel/recorders/start?id=${id}`, {}, {headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }})).data;
    }


    public async setUserBlock(username: string, block: boolean): Promise<void> {
        await axios.post<void>(`${Constants.AUTH_SERVICE}/users/block`, {username: username, block: block}, {headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }});
    }

    public async getUserStrikes(username: string): Promise<StrikeDTO[]> {
        return (await axios.get<StrikeDTO[]>(`${Constants.AUTH_SERVICE}/users/strikes?username=${username}`, {headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }})).data;
    }

    public async getUserPanelty(username: string): Promise<number> {
        return (await axios.get<number>(`${Constants.AUTH_SERVICE}/users/panelty?username=${username}`, {headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }})).data;
    }

    public async resetPanelty(username: string): Promise<void> {
        await axios.put<void>(`${Constants.AUTH_SERVICE}/users/resetPanelty`, {username: username}, {headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }});
    }

    public async getUsers(username: string): Promise<UserDTO[]> {
        return (await axios.get<UserDTO[]>(`${Constants.AUTH_SERVICE}/users?username=${username}`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    public async isUserBlocked(username: string): Promise<boolean> {
        return (await axios.get<boolean>(`${Constants.AUTH_SERVICE}/users/isBlocked?username=${username}`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    public async deleteUser(name: string): Promise<string> {
        return (await axios.delete(`${Constants.AUTH_SERVICE}/users/delete`, { params: { username: name }, headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    public async addUser(user: UserDTO): Promise<UserDTO> {
        return (await axios.post(`${Constants.AUTH_SERVICE}/users/add`, { username: user.givenName, sn: user.sn, group: user.group, mail: user.mail, telephoneNumber: user.telephoneNumber }, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    public async modifyUser(oldUsername: string, user: UserDTO): Promise<UserDTO> {
        const body = [
            {
                username: oldUsername
            },
            {
                username: user.givenName,
                sn: user.sn,
                group: user.group,
                mail: user.mail,
                telephoneNumber: user.telephoneNumber
            }
        ];
        return (await axios.put(`${Constants.AUTH_SERVICE}/users/modify`, body, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    public async getUserGroup(username: string): Promise<string> {
        return (await axios.get(`${Constants.AUTH_SERVICE}/groups/user`, { params: { username: username }, headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })).data;
    }

    public async authenticateUser(username: string, password: string): Promise<UserDTO> {
        return (await axios.post(`${Constants.AUTH_SERVICE}/users/authenticate`, { username: username, password: password })).data;
    }

    public async localStorageStrike(token: string) {
        await axios.post(`${Constants.AUTH_SERVICE}/strike/localstorage`, { token: token});
    }

    public async getTokenUser(): Promise<UserDTO> {
        return (await axios.post(`${Constants.AUTH_SERVICE}/users/user`, { token: localStorage.getItem('accessToken')}, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }})).data;
    }
}