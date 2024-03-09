export class FilterDTO {

    constructor(room: string, deviceName: string, startAt: Date, endAt: Date) {
        this.room = room;
        this.deviceName = deviceName;
        this.startAt = new Date(startAt + "Z");
        this.endAt = new Date(endAt + "Z");
    }

    room: string;
    deviceName: string;
    startAt: Date;
    endAt: Date;
}