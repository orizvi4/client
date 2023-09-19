import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FilterDTO } from 'src/common/models/filterDTO.iterface';
import { RecordingDTO } from 'src/common/models/recordingDTO.interface';
import { RoomRecordings } from 'src/common/models/roomRecordingsDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private requestService: RequestService) { }

  @ViewChild('startTime') startTime!: ElementRef;
  @ViewChild('endTime') endTime!: ElementRef;
  roomRecordings: RoomRecordings[] = [];
  init!: Promise<void>;

  async filterRecordings() {
    for (const roomRecording of this.roomRecordings) {
      for (const stream of roomRecording.streams) {
        const player: Player = videojs.getPlayer(stream[0]);
        player.dispose();
      }
    }
    const filter: FilterDTO = { startAt: this.startTime.nativeElement.value, endAt: this.endTime.nativeElement.value };
    this.roomRecordings = await this.requestService.getRecordings(filter);
    for (const roomRecording of this.roomRecordings) {
      roomRecording.streams = new Map<string, string>([]);
      const recordings: string[] = roomRecording.recordings;
      for (let i = 0; i < recordings.length; i++) {
        roomRecording.streams.set("record" + i, recordings[i]);
      }
      setTimeout(() => {
        for (const stream of roomRecording.streams) {
          console.log(stream[1]);
          const player: Player = videojs(stream[0], {
            autoplay: 'muted',
            controls: true,
            loop: true
          });
          player.src({
            src: stream[1],
            type: 'application/x-mpegURL'
          });
        }
      }, 0);
    }
  }

  async ngOnInit() {
    this.init = new Promise<void>(async (resolve) => {
      this.roomRecordings = await this.requestService.getRecordings();
      for (const roomRecording of this.roomRecordings) {
        roomRecording.streams = new Map<string, string>([]);
        const recordings: string[] = roomRecording.recordings;
        for (let i = 0; i < recordings.length; i++) {
          roomRecording.streams.set("record" + i, recordings[i]);
        }
      }
      resolve();
    })
  }
  async ngAfterViewInit() {
    await this.init;
    for (const roomRecording of this.roomRecordings) {
      for (const stream of roomRecording.streams) {
        console.log(stream[0]);
        setTimeout(() => {
          const player: Player = videojs(stream[0], {
            autoplay: 'muted',
            controls: true,
            loop: true
          });
          player.src({
            src: stream[1],
            type: 'application/x-mpegURL'
          });
        });
      }
    }
  }
  ngOnDestroy(): void {
    for (const roomRecording of this.roomRecordings) {
      for (const stream of roomRecording.streams) {
        const player: Player = videojs.getPlayer(stream[0]);
        player.dispose();
      }
    }
  }

}
