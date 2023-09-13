import { DeviceDTO } from "./deviceDTO.interface";

export interface ChannelDTO {
    _id: string;
    uri: string;
    device: DeviceDTO;
}