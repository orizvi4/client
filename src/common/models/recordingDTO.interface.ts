import { ChannelDTO } from "./channelDTO.interface";

export interface RecordingDTO {
    _id: string;
    url: string;
    startAt: Date;
    endAt: Date;
    channel: ChannelDTO;
}