import { UserDTO } from "./userDTO.interface";

export interface RoomInfoDTO {
    roomId: string;
    userCount: number;
    users: UserDTO[];
    channelsCount: number;
}