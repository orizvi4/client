import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FilterDTO } from 'src/common/models/filterDTO.iterface';
import { RecordingDTO } from 'src/common/models/recordingDTO.interface';
import { RoomRecordings } from 'src/common/models/roomRecordingsDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import Swal from 'sweetalert2';

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
  formUpload: boolean = false;

  async ngOnInit(): Promise<void> {
    this.init = new Promise<void>(async (resolve) => {
      await this.updateStreams();
      resolve();
    })
  }
  async ngAfterViewInit(): Promise<void> {
    await this.init;
    await this.updateVideoPlayers();
  }
  ngOnDestroy(): void {
    this.deleteVideoPlayers();
  }

  async filterRecordings(): Promise<void> {
    if (this.startTime.nativeElement.value != '' && this.endTime.nativeElement.value != '') {
      this.deleteVideoPlayers();
      const filter: FilterDTO = { startAt: this.startTime.nativeElement.value, endAt: this.endTime.nativeElement.value };
      await this.updateStreams(filter);
      await this.updateVideoPlayers();
    }
    else {
      Swal.fire({
        title: 'fill in the time input please',
        icon: 'warning',
      });
    }
  }

  async updateStreams(filter?: FilterDTO): Promise<void> { //updates the room recordings array
    this.roomRecordings = await this.requestService.getRecordings(filter);
    for (const roomRecording of this.roomRecordings) {
      roomRecording.streams = new Map<string, string>([]);
      const recordings: string[] = roomRecording.recordings;
      for (let i = 0; i < recordings.length; i++) {
        roomRecording.streams.set("record" + i, recordings[i]);
      }
    }
  }

  async updateVideoPlayers(): Promise<void> { //add all the video elements
    for (const roomRecording of this.roomRecordings) {
      for (const stream of roomRecording.streams) {
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

  deleteVideoPlayers(): void {//deletes all the video elements 
    for (const roomRecording of this.roomRecordings) {
      for (const stream of roomRecording.streams) {
        const player: Player = videojs.getPlayer(stream[0]);
        player.dispose();
      }
    }
  }
  async deleteRecording(recording: string) {
    recording = recording.substring(30, recording.indexOf('/playlist'));
    const res = await this.requestService.deleteRecording(recording);
    if (res == true) {
      if (this.startTime.nativeElement.value != '' && this.endTime.nativeElement.value != '') {
        await this.filterRecordings();
      }
      else {
        this.deleteVideoPlayers();
        const filter: FilterDTO = { startAt: new Date(0), endAt: new Date() };
        await this.updateStreams(filter);
        await this.updateVideoPlayers();
      }
    }
    else {
      Swal.fire({
        title: 'server error',
        icon: 'error',
        text: "couldn't delete"
      });
    }
  }
  async toggleUpload(uploaded?: boolean) {
    this.formUpload = !this.formUpload;
    if (uploaded) {
      if (this.startTime.nativeElement.value != '' && this.endTime.nativeElement.value != '') {
        await this.filterRecordings();
      }
      else {
        this.deleteVideoPlayers();
        const filter: FilterDTO = { startAt: new Date(0), endAt: new Date() };
        await this.updateStreams(filter);
        await this.updateVideoPlayers();
      }
    }
  }

}
