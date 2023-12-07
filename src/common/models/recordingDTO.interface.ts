import { ChannelDTO } from "./channelDTO.interface";

export interface RecordingDTO {
    _id: string;
    link: string;
    startAt: Date;
    endAt: Date;
    channel: ChannelDTO;
}