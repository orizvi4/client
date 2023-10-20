import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChannelDTO } from 'src/common/models/channelDTO.interface';
import { RequestService } from 'src/common/services/request.service';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {
  constructor(private requestService: RequestService) {}

  channels: ChannelDTO[] = [];
  @Output() popup = new EventEmitter();

  async ngOnInit(): Promise<void> {
    this.channels = await this.requestService.getChannels();
  }
  save() {

  }
  cancel() {
    this.popup.emit();
  }
}
