import { ChannelDTO } from "./channelDTO.interface";

export interface RoomDTO {
    _id: string;
    name: string;
    channels: ChannelDTO[];
}