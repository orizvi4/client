export interface RoomRecordings {
    room: string;
    recordings: string[];
    streams: {[id: string]: string};
}