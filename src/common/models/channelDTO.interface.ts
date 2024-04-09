import { DeviceDTO } from "./deviceDTO.interface";

export interface ChannelDTO {
    _id: string;
    isLive: boolean;
    enableMotionDetection: boolean;
    isRecording: boolean;
    isBlocked: boolean;
    device: DeviceDTO;
}