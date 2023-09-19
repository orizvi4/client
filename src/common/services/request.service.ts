import { Injectable } from "@angular/core";
import axios, { AxiosResponse } from "axios";
import { RoomDTO } from "../models/roomDTO.interface";
import { Constants } from "../constants";
import { ChannelDTO } from "../models/channelDTO.interface";
import { FilterDTO } from "../models/filterDTO.iterface";
import { RecordingDTO } from "../models/recordingDTO.interface";

@Injectable()
export class RequestService {
    constructor(private constants: Constants) { }
    async getAllRooms(): Promise<RoomDTO[]> {
        return (await axios.get<RoomDTO[]>(`${this.constants.ROOM_HANDLER}/room/all`)).data;
    }
    async getRoomById(id: string): Promise<RoomDTO> {
        return (await axios.get<RoomDTO>(`${this.constants.ROOM_HANDLER}/room/id`, { params: { id: id } })).data;
    }
    async connectChannel(id: string): Promise<any> {
        return (await axios.put<string>(`${this.constants.ROOM_HANDLER}/channel/connect?id=${id}`)).data;
    }
    async getRecordings(filter?: FilterDTO): Promise<string[]> {
        if (filter == null) {
            return (await axios.get<string[]>(`${this.constants.ROOM_HANDLER}/recording`, { params: { start: 0, end: new Date(Date.now()) } })).data;
        }
        else {
            return (await axios.get<string[]>(`${this.constants.ROOM_HANDLER}/recording`, { params: { start: filter.startAt, end: filter.endAt } })).data;
        }
    }
}