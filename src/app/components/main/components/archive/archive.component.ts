import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FilterDTO } from 'src/common/models/filterDTO.class';
import { RequestService } from 'src/common/services/request.service';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import Swal from 'sweetalert2';
import { ChannelDTO } from 'src/common/models/channelDTO.interface';
import { RoomDTO } from 'src/common/models/roomDTO.interface';
import { DeviceDTO } from 'src/common/models/deviceDTO.interface';
import { RecordingDTO } from 'src/common/models/recordingDTO.interface';
import { PageEvent } from '@angular/material/paginator';
import { WebSocketService } from 'src/common/services/web-socket.service';


@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements OnInit {
  constructor(private requestService: RequestService, private websocketService: WebSocketService) {
    this.websocketService.getRecordingDelete$().subscribe(async (recordingUrl: string) => {
      this.deleteRecordingFromArray(recordingUrl.substring(recordingUrl.indexOf("content/") + 8));
    });
  }

  @ViewChild('startTime') startTime!: ElementRef;
  @ViewChild('endTime') endTime!: ElementRef;
  @ViewChild('roomSelect') roomSelect!: ElementRef;
  @ViewChild('channelSelect') channelSelect!: ElementRef;

  formUpload: boolean = false;
  group: string = '';
  deviceNames: string[] = [];
  rooms: RoomDTO[] = [];
  timeFilter: boolean = false;//filter by time or not
  recordings: RecordingDTO[] = [];
  currentRecordings: RecordingDTO[] = [];
  pageSize: number = 4;
  pageIndex: number = 0;

  async ngOnInit(): Promise<void> {
    try {
      this.group = history.state.group;
      this.rooms = await this.requestService.getAllRooms();
      const devices: DeviceDTO[] = await this.requestService.getAllDevices();
      for (const device of devices) {
        this.deviceNames.push(device.title);
      }
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

  public timeToggle() {
    this.timeFilter = !this.timeFilter;
  }

  public onPageChange(pageEvent: PageEvent): void {
    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.currentRecordings = this.recordings.slice(pageEvent.pageIndex * pageEvent.pageSize, pageEvent.pageIndex * pageEvent.pageSize + pageEvent.pageSize);
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
      this.recordings = await this.requestService.getRecordings(filter);
      this.currentRecordings = this.recordings.slice(0, this.pageSize);
      this.pageIndex = 0;
    }
    catch (err) {
      this.recordings = [];
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
    for (let [index, element] of this.recordings.entries()) {
      const tempRecording: string = element.link.substring(element.link.indexOf("/mp4:") + 5, element.link.indexOf('/playlist'));
      if (tempRecording === name) {
        this.recordings.splice(index, 1);
        if (this.currentRecordings.length === 1) {
          this.pageIndex -= 1;
        }
        this.currentRecordings = this.recordings.slice(this.pageIndex * this.pageSize, this.pageIndex * this.pageSize + this.pageSize);
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
          icon: 'success',
          title: "deleted recording successfuly"
        });
      }
    }
  }

  public setRecordingDeleting(name: string): void {
    for (let [index, element] of this.recordings.entries()) {
      const tempRecording: string = element.link.substring(element.link.indexOf("/mp4:") + 5, element.link.indexOf('/playlist'));
      if (tempRecording === name) {
        this.recordings[index].isDeleting = true;
      }
    }
  }

  public async deleteRecording(recordingLink: string) {
    const recording = recordingLink.substring(recordingLink.indexOf("/mp4:") + 5, recordingLink.indexOf('/playlist'));
    try {
      const res = await Swal.fire({
        icon: 'warning',
        title: 'delete recording',
        text: 'are you sure you want to delete the recording?',
        showCancelButton: true,
        confirmButtonText: 'delete'
      });
      if (res.isConfirmed) {
        await this.requestService.deleteRecording(recording);
        this.deleteRecordingFromArray(recording);
      }
    }
    catch (err: any) {
      if (err.response !== null && err.response.status == 400) {
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
        });
        Toast.fire({
          title: "deleting recording",
          didOpen: () => {
            Swal.showLoading();
          }
        });
        this.setRecordingDeleting(recording);
      }
      else {
        Swal.fire({
          title: 'server error',
          icon: 'error',
          text: "couldn't delete because of server error, try again later"
        });
      }
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
