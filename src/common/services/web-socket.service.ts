import { io } from "socket.io-client";
import { ChannelDTO } from "../models/channelDTO.interface";
import { WebsocketTitles } from "../enums.model";
import { Observable, Subject } from "rxjs";
import { Injectable, numberAttribute } from "@angular/core";
import { NavBarComponent } from "src/app/components/main/components//nav-bar/nav-bar.component";
import { AppRoutingModule } from "src/app/app-routing.module";
import { Router } from "@angular/router";
import { JwtService } from "./jwt.service";
import Swal from "sweetalert2";
import { RecordingDTO } from "../models/recordingDTO.interface";
import { RoomInfoDTO } from "../../app/components/main/components/room/components/room-info/models/roomInfoDTO.interface";
import { RequestService } from "./request.service";

@Injectable()
export class WebSocketService {
    constructor(private router: Router, private jwtService: JwtService, private requestService: RequestService) {
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

        socket.on(WebsocketTitles.ROOM_INFO, (info: RoomInfoDTO) => {
            this.roomInfo$.next(info);
        });

        socket.on(WebsocketTitles.RECORDING_DELETE, (recordingUrl: string) => {
            this.recordingDelete$.next(recordingUrl);
        });

        socket.on(WebsocketTitles.MOTION_DETECTED, (name: string) => {
            if (this.enableMotionDetection.indexOf(name) === -1) {
                this.motionDetected$.next(name);
            }
        });

        socket.on(WebsocketTitles.SIGNOUT, async (username) => {
            console.log('Incoming message: sign out ' + username);
            if (username === this.jwtService.decode().username as string) {
                await this.requestService.roomRemoveUserAll(this.jwtService.decode().username as string);
                this.jwtService.setLocalStorageToken(false);
                await this.jwtService.blackListToken();
                localStorage.clear();
                await Swal.fire({
                    title: "session error",
                    text: "unauthorized activities detected, please talk to a system manager or login again",
                    icon: "error",
                    background: "#101416",
                    color: "white",
                });
                this.router.navigate(['login']);
            }
        });
    }
    channelUpdate$: Subject<ChannelDTO> = new Subject<ChannelDTO>();
    recordingDelete$: Subject<string> = new Subject<string>();
    motionDetected$: Subject<string> = new Subject<string>();
    roomInfo$: Subject<RoomInfoDTO> = new Subject<RoomInfoDTO>();
    enableMotionDetection: string[] = [];

    public setMotionDetection(channel: string, motionDetection: boolean): void {
        if (motionDetection) {
            const index: number = this.enableMotionDetection.indexOf(channel);
            if (index !== -1) {
                this.enableMotionDetection.splice(index, 1);
            }
        }
        else {
            this.enableMotionDetection.push(channel);
        }
    }

    public getChannelUpdate$(): Observable<ChannelDTO> {
        return this.channelUpdate$.asObservable();
    }

    public getMotionDetected$(): Observable<string> {
        return this.motionDetected$.asObservable();
    }

    public getRoomInfo$(): Observable<RoomInfoDTO> {
        return this.roomInfo$.asObservable();
    }

    public getRecordingDelete$(): Observable<string> {
        return this.recordingDelete$.asObservable();
    }


}