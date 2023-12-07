import { RecordingDTO } from "./recordingDTO.interface";

export interface RoomRecordingsDTO {
    room: string;
    recordings: RecordingDTO[];
}