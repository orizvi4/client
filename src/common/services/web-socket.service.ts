import { io } from "socket.io-client";
import { ChannelDTO } from "../models/channelDTO.interface";
import { WebsocketTitles } from "../enums.model";
import { Observable, Subject } from "rxjs";

export class WebSocketService {
    constructor() {
        const socket = io("http://192.168.1.5:8080");

        socket.on("connect", () => {
            console.log('connected to websocket');
        });

        // socket.emit('join_room', {
        //     roomName: 'vehicle',
        // });

        socket.on(WebsocketTitles.CHANNEL_LIVE, (channel: ChannelDTO) => {
            console.log('Incoming message:', channel);
            this.channelUpdate$.next(channel);
        });
    }
    channelUpdate$: Subject<ChannelDTO> = new Subject<ChannelDTO>();

    public getChannelUpdate$(): Observable<ChannelDTO> {
        return this.channelUpdate$.asObservable();
    }

}