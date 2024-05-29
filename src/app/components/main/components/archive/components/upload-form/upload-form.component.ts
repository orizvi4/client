import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ChannelDTO } from 'src/common/models/channelDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {
  constructor(private requestService: RequestService) { }

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('startTime') startTime!: ElementRef;
  @ViewChild('channelSelect') channelSelect!: ElementRef;
  @Output() popup = new EventEmitter<boolean>();

  readonly todayDate: string = new Date().toISOString().split('T')[0] + "T00:00";
  channels: ChannelDTO[] = [];

  async ngOnInit(): Promise<void> {
    this.channels = await this.requestService.getAllChannels();
  }

  async save() {
    try {
      if (this.fileInput.nativeElement.value != '' && this.startTime.nativeElement.value != '') {
        const saved: boolean = await this.requestService.saveRecording(this.fileInput, this.startTime.nativeElement.value, this.channelSelect.nativeElement.value);
        if (saved == true) {
          await Swal.fire({
            icon: 'success',
            title: 'video added succesfully',
            background: "#101416",
            color: "white",
          });
          this.popup.emit(true);
        }
        else {
          await Swal.fire({
            icon: 'error',
            title: 'recording is overlapping with another video',
            background: "#101416",
            color: "white",
          });
        }
      }
      else {
        await Swal.fire({
          icon: 'error',
          title: 'fill all the data',
          background: "#101416",
          color: "white",
        });
      }
    }
    catch (err: any) {
      console.log(err);
      if (err.response != null || err.response.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Wrong file format',
          text: 'please enter a video file',
          background: "#101416",
          color: "white",
        });
      }
      else if (err.response != null || err.response.status === 409) {
        await Swal.fire({
          icon: 'warning',
          title: 'date invalid',
          text: 'date already exist',
          background: "#101416",
          color: "white",
        })
        return;
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'server error',
          text: 'please try again later',
          background: "#101416",
          color: "white",
        });
      }
    }
  }

  async cancel() {
    if (this.startTime.nativeElement.value !== '' || this.fileInput.nativeElement.value !== '') {
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
        this.popup.emit(false);
      }
    }
    else {
      this.popup.emit(false);
    }
  }
}
