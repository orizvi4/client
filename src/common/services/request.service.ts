import { ElementRef, Injectable } from "@angular/core";
import axios from "axios";
import { RoomDTO } from "../models/roomDTO.interface";
import { Constants } from "../constants";
import { ChannelDTO } from "../models/channelDTO.interface";
import { FilterDTO } from "../models/filterDTO.iterface";
import { RecordingDTO } from "../models/recordingDTO.interface";
import { RoomRecordings } from "../models/roomRecordingsDTO.interface";
import { UserDTO } from "../models/userDTO.interface";
import Cookies from "js-cookie";

@Injectable()
export class RequestService {
    async getChannels(): Promise<ChannelDTO[]> {
        return (await axios.get<ChannelDTO[]>(`${Constants.ROOM_HANDLER}/channel/all`)).data;
    }
    async getAllRooms(): Promise<RoomDTO[]> {
        return (await axios.get<RoomDTO[]>(`${Constants.ROOM_HANDLER}/room/all`, {timeout: 2000})).data;
    }
    async getRoomById(id: string): Promise<RoomDTO> {
        return (await axios.get<RoomDTO>(`${Constants.ROOM_HANDLER}/room/id`, { params: { id: id } })).data;
    }
    async connectChannel(id: string): Promise<any> {
        return (await axios.put<string>(`${Constants.ROOM_HANDLER}/channel/connect?id=${id}`)).data;
    }
    async getRecordings(filter?: FilterDTO): Promise<RoomRecordings[]> {
        if (filter == null) {
            return (await axios.get<RoomRecordings[]>(`${Constants.ROOM_HANDLER}/recording`, { params: { start: 0, end: new Date(Date.now()) } })).data;
        }
        else {
            return (await axios.get<RoomRecordings[]>(`${Constants.ROOM_HANDLER}/recording`, { params: { start: filter.startAt, end: filter.endAt } })).data;
        }
    }
    async saveRecording(file: ElementRef, start: string, end: string, channel: string) {
        let suffix;
        try {
            suffix = (await axios.get<number>(`${Constants.CONTENT_MANAGER}/file/suffix`, {params: {channel: channel}})).data + 1;
        }
        catch(err) {
            throw err;
        }
        const formData = new FormData();
        formData.append('file', file.nativeElement.files[0]);
        formData.append('startAt', start);
        formData.append('endAt', end);
        return (await axios.post<boolean>(`${Constants.CONTENT_MANAGER}/file/upload`, formData, {params: {channel: channel, suffix: suffix}})).data;
    }
    async isDateValid(start: string, end: string, channel: string): Promise<boolean> {
        return (await axios.post<boolean>(`${Constants.CONTENT_MANAGER}/file/date`, {startAt: start, endAt: end, channel: channel})).data;
    }
    async deleteRecording(id: string): Promise<boolean> {
        return (await axios.delete<boolean>(`${Constants.CONTENT_MANAGER}/delete`, { params: { file: id } })).data;
    }
    async stopChannelRecording(id: string) {
        await axios.put<string>(`${Constants.ROOM_HANDLER}/channel/recorders/stop?id=${id}`);
    }
    async startChannelRecording(id: string) {
        await axios.post<string>(`${Constants.ROOM_HANDLER}/channel/recorders/start?id=${id}`);
    }


    async getUsers(): Promise<UserDTO[]> {
        return (await axios.get<UserDTO[]>(`${Constants.AUTH_SERVICE}/users`,{headers: {Authorization: `Bearer ${Cookies.get('accessToken')}`}})).data;
    }
    async deleteUser(name: string): Promise<string> {
        return (await axios.delete(`${Constants.AUTH_SERVICE}/users/delete`, {params: {username: name}, headers: {Authorization: `Bearer ${Cookies.get('accessToken')}`}})).data;
    }
    async addUser(user: UserDTO): Promise<UserDTO> {
        return (await axios.post(`${Constants.AUTH_SERVICE}/users/add`, {username: user.givenName, sn: user.sn, group: user.group},{headers: {Authorization: `Bearer ${Cookies.get('accessToken')}`}})).data;
    }
    async modifyUser(oldUsername:string, user: UserDTO): Promise<UserDTO> {
        const body = [
            {
                username: oldUsername
            },
            {
                username: user.givenName,
                sn: user.sn,
                group: user.group
            }
        ];
        return (await axios.put(`${Constants.AUTH_SERVICE}/users/modify`, body, {headers: {Authorization: `Bearer ${Cookies.get('accessToken')}`}})).data;
    }
    async getUserGroup(username: string): Promise<string> {
        return (await axios.get(`${Constants.AUTH_SERVICE}/groups/user`, {params: {username: username}, headers: {Authorization: `Bearer ${Cookies.get('accessToken')}`}})).data;
    }
    async authenticateUser(username: string, password: string): Promise<UserDTO> {
        return (await axios.post(`${Constants.AUTH_SERVICE}/users/authenticate`, {username: username, password: password})).data;
    }
}