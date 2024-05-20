import { SafeUrl } from "@angular/platform-browser";
import { thumbnailMode } from "src/common/enums.model";
import { ChannelDTO } from "src/common/models/channelDTO.interface";

export interface Thumbnail {
    mode: thumbnailMode;
    url: SafeUrl | null;
}