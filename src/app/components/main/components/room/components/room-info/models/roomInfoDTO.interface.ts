import { UserDTO } from "../../../../../../../../common/models/userDTO.interface";
import { RoomMessageDTO } from "./roomMessageDTO.model";

export interface RoomInfoDTO {
    roomId: string;
    userCount: number;
    users: UserDTO[];
    channelsCount: number;
    messages: RoomMessageDTO[];
}