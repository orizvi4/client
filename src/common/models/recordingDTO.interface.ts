import { ChannelDTO } from "./channelDTO.interface";

export interface RecordingDTO {
    _id: string;
    link: string;
    isDeleting: boolean;
    startAt: Date;
    endAt: Date;
    channel: ChannelDTO;
}