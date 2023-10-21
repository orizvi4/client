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
  constructor(private requestService: RequestService) {}

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('startTime') startTime!: ElementRef;
  @ViewChild('endTime') endTime!: ElementRef;
  @ViewChild('channelSelect') channelSelect!: ElementRef;
  @Output() popup = new EventEmitter<boolean>();
  channels: ChannelDTO[] = [];

  async ngOnInit(): Promise<void> {
    this.channels = await this.requestService.getChannels();
  }
  async save() {
    if (this.fileInput.nativeElement.value != '' && this.startTime.nativeElement.value != '' && this.endTime.nativeElement.value != '') {
      let res: boolean = await this.requestService.isDateValid(this.startTime.nativeElement.value, this.endTime.nativeElement.value, this.channelSelect.nativeElement.value);
      if (res) {
        res = await this.requestService.saveRecording(this.fileInput, this.startTime.nativeElement.value, this.endTime.nativeElement.value, this.channelSelect.nativeElement.value);
      }
      else {
        await Swal.fire({
          icon: 'warning',
          title: 'date invalid',
          text: 'date already exist'
        })
        return;
      }
      if (res) {
        await Swal.fire({
          icon: 'success',
          title: 'video added succesfully'
        });
      }
      else {
        await Swal.fire({
          icon: 'error',
          title: 'server error',
          text: 'try again'
        })
      }
      this.popup.emit(true);
    }
    else {
      await Swal.fire({
        icon: 'error',
        title: 'fill all the data'
      });
    }
  }
  async cancel() {
    const res = await Swal.fire({
      icon: 'warning',
      title: 'are you sure you want to cancel?',
      cancelButtonText: 'No',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes'
    });
    if (res.isConfirmed) {
      this.popup.emit(false);
    }
  }
}
