export interface RoomRecordings {
    room: string;
    recordings: string[];
    streams: Map<string, string>;
}