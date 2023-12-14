export class FilterDTO {

    constructor(room: string, channel: string, startAt: Date, endAt: Date) {
        this.room = room;
        this.channel = channel;
        this.startAt = new Date(startAt + "Z");
        this.endAt = new Date(endAt + "Z");
    }

    room: string;
    channel: string;
    startAt: Date;
    endAt: Date;
}