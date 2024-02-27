import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FilterDTO } from 'src/common/models/filterDTO.class';
import { RoomRecordingsDTO } from 'src/common/models/roomRecordingsDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import Swal from 'sweetalert2';
import { ChannelDTO } from 'src/common/models/channelDTO.interface';
import { RoomDTO } from 'src/common/models/roomDTO.interface';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements OnInit {
  constructor(private requestService: RequestService) { }

  @ViewChild('startTime') startTime!: ElementRef;
  @ViewChild('endTime') endTime!: ElementRef;
  @ViewChild('roomSelect') roomSelect!: ElementRef;
  @ViewChild('channelSelect') channelSelect!: ElementRef;

  roomRecordings: RoomRecordingsDTO[] = [];
  formUpload: boolean = false;
  group: string = '';
  channels: ChannelDTO[] = [];
  rooms: RoomDTO[] = [];
  deleteId: string = '';
  timeFilter: boolean = false;//filter by time or not

  async ngOnInit(): Promise<void> {
    try {
      this.group = history.state.group;
      this.channels = await this.requestService.getAllChannels();
      this.rooms = await this.requestService.getAllRooms();
      try {
        await this.updateStreams();
      }
      catch (err) {
        console.log(err);
      }
    }
    catch (err: any) {
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

  timeToggle() {
    this.timeFilter = !this.timeFilter;
  }


  private filterRecordings(): FilterDTO {
    if (this.timeFilter) {
      if (this.startTime.nativeElement.value != '' && this.endTime.nativeElement.value != '') {
        return new FilterDTO(this.roomSelect.nativeElement.value, this.channelSelect.nativeElement.value, this.startTime.nativeElement.value, this.endTime.nativeElement.value);
      }
      else if (this.startTime.nativeElement.value == '' && this.endTime.nativeElement.value == '') {
        return new FilterDTO(this.roomSelect.nativeElement.value, this.channelSelect.nativeElement.value, new Date(0), new Date());
      }
      else if (this.startTime.nativeElement.value != '') {
        return new FilterDTO(this.roomSelect.nativeElement.value, this.channelSelect.nativeElement.value, this.startTime.nativeElement.value, new Date());
      }
      else {
        return new FilterDTO(this.roomSelect.nativeElement.value, this.channelSelect.nativeElement.value, new Date(0), this.endTime.nativeElement.value);
      }
    }
    else {
      return new FilterDTO(this.roomSelect.nativeElement.value, this.channelSelect.nativeElement.value, new Date(0), new Date());
    }
  }

  public async updateStreams(): Promise<void> {
    try {
      const filter: FilterDTO = this.filterRecordings();
      this.roomRecordings = await this.requestService.getRecordings(filter);
    }
    catch (err) {
      this.roomRecordings = [];
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
      throw err;
    }
  }

  public deleteRecordingFromArray(name: string): void {
    for (let i: number = 0; i < this.roomRecordings.length; i++) {
      for (let j: number = 0; j < this.roomRecordings[i].recordings.length; j++) {
        const tempRecording: string = this.roomRecordings[i].recordings[j].link.substring(this.roomRecordings[i].recordings[j].link.indexOf("/mp4:") + 5, this.roomRecordings[i].recordings[j].link.indexOf('/playlist'));
        if (tempRecording == name) {
          this.deleteId = this.roomRecordings[i].recordings[j]._id;
          this.roomRecordings[i].recordings.splice(j, 1);
        }
      }
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
        this.deleteRecordingFromArray(recording);
      }
    }
    catch (err: any) {
      if (err.response.status == 400) {
        Swal.fire({
          title: 'request error',
          icon: 'error',
          text: "couldn't delete recording because the app uploads videos, try again in a few seconds"
        });
      }
      Swal.fire({
        title: 'server error',
        icon: 'error',
        text: "couldn't delete because of server error, try again later"
      });
    }
  }
  async toggleUpload(uploaded?: boolean) {
    try {
      this.formUpload = !this.formUpload;
      if (uploaded) {
        await this.updateStreams();
      }
    }
    catch (err) {
      console.log(err);
    }
  }

}
