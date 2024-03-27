import { io } from "socket.io-client";
import { ChannelDTO } from "../models/channelDTO.interface";
import { WebsocketTitles } from "../enums.model";
import { Observable, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { NavBarComponent } from "src/app/components/main/components//nav-bar/nav-bar.component";
import { AppRoutingModule } from "src/app/app-routing.module";
import { Router } from "@angular/router";
import { JwtService } from "./jwt.service";
import Swal from "sweetalert2";
import { RecordingDTO } from "../models/recordingDTO.interface";

@Injectable()
export class WebSocketService {
    constructor(private router: Router, private jwtService: JwtService) {
        const socket = io("http://192.168.1.5:8080");

        socket.on("connect", () => {
            console.log('connected to websocket');
        });
        
        // socket.emit('join_room', {
        //     roomName: 'vehicle',
        // });
        
        socket.on(WebsocketTitles.CHANNEL_LIVE, (channel: ChannelDTO) => {
            this.channelUpdate$.next(channel);
        });

        socket.on(WebsocketTitles.RECORDING_DELETE, (recordingUrl: string) => {
            this.recordingDelete$.next(recordingUrl);
        });

        socket.on(WebsocketTitles.MOTION_DETECTED, (name: string) => {
            this.motionDetected$.next(name);
        });

        socket.on(WebsocketTitles.SIGNOUT, async () => {
            console.log('Incoming message: sign out');
            this.jwtService.setLocalStorageToken(false);
            await this.jwtService.blackListToken();
            localStorage.clear();
            await Swal.fire({
                title: "session error",
                text: "unauthorized activities detected, please talk to a system manager or login again",
                icon: "error",
            });
            this.router.navigate(['login']);
        });
    }
    channelUpdate$: Subject<ChannelDTO> = new Subject<ChannelDTO>();
    recordingDelete$: Subject<string> = new Subject<string>();
    motionDetected$: Subject<string> = new Subject<string>();

    public getChannelUpdate$(): Observable<ChannelDTO> {
        return this.channelUpdate$.asObservable();
    }

    public getMotionDetected$(): Observable<string> {
        return this.motionDetected$.asObservable();
    }

    public getRecordingDelete$(): Observable<string> {
        return this.recordingDelete$.asObservable();
    }


}