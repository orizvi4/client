import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FilterDTO } from 'src/common/models/filterDTO.iterface';
import { RoomRecordingsDTO } from 'src/common/models/roomRecordingsDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  constructor(private requestService: RequestService) { }

  @ViewChild('startTime') startTime!: ElementRef;
  @ViewChild('endTime') endTime!: ElementRef;
  roomRecordings: RoomRecordingsDTO[] = [];
  init!: Promise<void>;
  formUpload: boolean = false;
  group: string = '';

  async ngOnInit(): Promise<void> {
    try {
      this.group = history.state.group;
      await this.updateStreams();
    }
    catch (err) {
      console.log(err);
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: 'error',
        title: "couldn't load recordings, try again later"
      });
    }
  }


  async filterRecordings(): Promise<void> {
    try {
      if (this.startTime.nativeElement.value != '' && this.endTime.nativeElement.value != '') {

        const filter: FilterDTO = { startAt: this.startTime.nativeElement.value, endAt: this.endTime.nativeElement.value };
        await this.updateStreams(filter);
      }
      else {
        Swal.fire({
          title: 'fill in the time input please',
          icon: 'warning',
        });
      }
    }
    catch (err) {
      console.log(err);
      await Swal.fire({
        title: 'server error',
        icon: 'error',
        text: "couldn't load recordings, try again later"
      });
    }
  }

  private async updateStreams(filter?: FilterDTO): Promise<void> {
    try {
      this.roomRecordings = await this.requestService.getRecordings(filter);
    }
    catch (err) {
      this.roomRecordings = [];
      throw err;
    }
  }

  async deleteRecording(recording: string) {
    try {
      const res = await Swal.fire({
        icon: 'warning',
        title: 'delete recording',
        text: 'are you sure you want to delete the recording?',
        showCancelButton: true,
        confirmButtonText: 'delete'
      });
      if (res.isConfirmed) {
        recording = recording.substring(recording.indexOf("/mp4:") + 5, recording.indexOf('/playlist'));
        await this.requestService.deleteRecording(recording);
        if (this.startTime.nativeElement.value != '' && this.endTime.nativeElement.value != '') {
          await this.filterRecordings();
        }
        else {
          const filter: FilterDTO = { startAt: new Date(0), endAt: new Date() };
          await this.updateStreams(filter);
        }
      }
    }
    catch (err) {
      Swal.fire({
        title: 'server error',
        icon: 'error',
        text: "couldn't delete, try again later"
      });
    }
  }
  async toggleUpload(uploaded?: boolean) {
    try {
      this.formUpload = !this.formUpload;
      if (uploaded) {
        if (this.startTime.nativeElement.value != '' && this.endTime.nativeElement.value != '') {
          await this.filterRecordings();
        }
        else {
          const filter: FilterDTO = { startAt: new Date(0), endAt: new Date() };
          await this.updateStreams(filter);
        }
      }
    }
    catch (err) {
      console.log(err);
      await Swal.fire({
        title: 'server error',
        icon: 'error',
        text: "couldn't load recordings, try again later"
      });
    }
  }

}
