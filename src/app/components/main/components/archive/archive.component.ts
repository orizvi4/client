import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FilterDTO } from 'src/common/models/filterDTO.class';
import { RequestService } from 'src/common/services/request.service';
import videojs from 'video.js';
import Swal from 'sweetalert2';
import { ChannelDTO } from 'src/common/models/channelDTO.interface';
import { RoomDTO } from 'src/common/models/roomDTO.interface';
import { DeviceDTO } from 'src/common/models/deviceDTO.interface';
import { RecordingDTO } from 'src/common/models/recordingDTO.interface';
import { PageEvent } from '@angular/material/paginator';
import { WebSocketService } from 'src/common/services/web-socket.service';
import { ToastrService } from 'ngx-toastr';
import { JwtService } from 'src/common/services/jwt.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements OnInit, OnDestroy {
  constructor(private requestService: RequestService,
    private websocketService: WebSocketService,
    private toastr: ToastrService,
    private jwtService: JwtService) {
    this.subscription = this.websocketService.getRecordingDelete$().subscribe(async (recordingUrl: string) => {
    console.log("delete");
      this.deleteRecordingFromArray(recordingUrl.substring(recordingUrl.indexOf("content/") + 8));
    });
  }

  @ViewChild('startTime') startTime!: ElementRef;
  @ViewChild('endTime') endTime!: ElementRef;
  @ViewChild('roomSelect') roomSelect!: ElementRef;
  @ViewChild('channelSelect') channelSelect!: ElementRef;
  subscription!: Subscription;

  formUpload: boolean = false;
  group: string = '';
  deviceNames: string[] = [];
  rooms: RoomDTO[] = [];
  timeFilter: boolean = false;//filter by time or not
  recordingsLength: number = 0;
  currentRecordings: RecordingDTO[] = [];
  pageSize: number = 4;
  pageIndex: number = 0;
  filter!: FilterDTO;

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    try {
      this.group = this.jwtService.decode().group as string;
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
      this.toastr.error("couldn't load recordings, try again later", "", {
        positionClass: 'toast-bottom-right',
        timeOut: 4000,
      });
    }
  }

  public timeToggle() {
    this.timeFilter = !this.timeFilter;
  }

  public async onPageChange(pageEvent: PageEvent): Promise<void> {
    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.currentRecordings = await this.requestService.getRecordings(this.filter, this.pageIndex, this.pageSize);
  }

  private filterRecordings(): void {
    if (this.timeFilter) {
      if (this.startTime.nativeElement.value != '' && this.endTime.nativeElement.value != '') {
        this.filter = new FilterDTO(this.roomSelect.nativeElement.value, this.channelSelect.nativeElement.value, this.startTime.nativeElement.value, this.endTime.nativeElement.value);
      }
      else if (this.startTime.nativeElement.value == '' && this.endTime.nativeElement.value == '') {
        this.filter = new FilterDTO(this.roomSelect.nativeElement.value, this.channelSelect.nativeElement.value, new Date(0), new Date());
      }
      else if (this.startTime.nativeElement.value != '') {
        this.filter = new FilterDTO(this.roomSelect.nativeElement.value, this.channelSelect.nativeElement.value, this.startTime.nativeElement.value, new Date());
      }
      else {
        this.filter = new FilterDTO(this.roomSelect.nativeElement.value, this.channelSelect.nativeElement.value, new Date(0), this.endTime.nativeElement.value);
      }
    }
    else {
      this.filter = new FilterDTO(this.roomSelect.nativeElement.value, this.channelSelect.nativeElement.value, new Date(0), new Date());
    }
  }

  public async updateStreams(): Promise<void> {
    try {
      this.filterRecordings();
      this.pageIndex = 0;
      this.recordingsLength = await this.requestService.getRecordingsLength(this.filter);
      this.currentRecordings = await this.requestService.getRecordings(this.filter, this.pageIndex, this.pageSize);
    }
    catch (err) {
      console.log(err);
      this.recordingsLength = 0;
      this.toastr.error("couldn't load recordings, try again later", "", {
        positionClass: 'toast-bottom-right',
        timeOut: 4000,
      });
      throw err;
    }
  }

  public async deleteRecordingFromArray(name: string): Promise<void> {
    this.recordingsLength -= 1;
    this.toastr.success("deleted recording successfuly", "", {
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
    });
    for (let [index, element] of this.currentRecordings.entries()) {
      const tempRecording: string = element.link.substring(element.link.indexOf("/mp4:") + 5, element.link.indexOf('/playlist'));
      if (tempRecording === name) {
        this.currentRecordings.splice(index, 1);
        if (this.currentRecordings.length < 1) {
          this.pageIndex -= 1;
        }
      }
    }
    this.currentRecordings = await this.requestService.getRecordings(this.filter, this.pageIndex, this.pageSize);
  }

  public setRecordingDeleting(name: string): void {
    for (let [index, element] of this.currentRecordings.entries()) {
      const tempRecording: string = element.link.substring(element.link.indexOf("/mp4:") + 5, element.link.indexOf('/playlist'));
      if (tempRecording === name) {
        this.currentRecordings[index].isDeleting = true;
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
        background: "#101416",
        color: "white",
        showCancelButton: true,
        confirmButtonText: 'delete'
      });
      if (res.isConfirmed) {
        await this.requestService.deleteRecording(recording);
        this.deleteRecordingFromArray(recording);
      }
    }
    catch (err: any) {
      if (err.response !== undefined && err.response !== null && err.response.status == 400) {
        this.setRecordingDeleting(recording);
      }
      else {
        Swal.fire({
          title: 'server error',
          icon: 'error',
          text: "couldn't delete because of server error, try again later",
          background: "#101416",
          color: "white",
        });
      }
    }
  }

  public async checkFormCancel() {
    const res = await Swal.fire({
      icon: 'warning',
      title: 'are you sure you want to cancel?',
      cancelButtonText: 'No',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes',
      background: "#101416",
      color: "white",
    });
    if (res.isConfirmed) {
      await this.toggleUpload();
    }
  }

  public async toggleUpload(uploaded?: boolean) {
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
