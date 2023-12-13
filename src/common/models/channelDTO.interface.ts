import { DeviceDTO } from "./deviceDTO.interface";

export interface ChannelDTO {
    _id: string;
    isLive: boolean;
    isRecording: boolean;
    device: DeviceDTO;
}