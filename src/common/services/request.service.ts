import { Injectable } from "@angular/core";
import axios, { AxiosResponse } from "axios";
import { RoomDTO } from "../models/roomDTO.interface";
import { Constants } from "../constants";

@Injectable()
export class RequestService {
    constructor(private constants: Constants) {}
    async getAllRooms(): Promise<RoomDTO[]> {
        return (await axios.get<RoomDTO[]>(`${this.constants.ROOM_HANDLER}/room/all`)).data;
    }
}