import { Location } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AxiosError } from 'axios';
import { RequestService } from 'src/common/services/request.service';
import Swal from 'sweetalert2';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements AfterViewInit, OnInit {
  constructor(private requestService: RequestService, private location: Location) { }

  @Input() id: string = '';
  @Input() recording: boolean = false;
  zoom: boolean = false;

  async ngOnInit(): Promise<void> {
    if (this.id == '') {
      this.id = "channelId" + (history.state).id;
      this.zoom = true;
    }
    this.recording = (await this.requestService.getChannel(this.id.substring(9))).isRecording;
  }
  async back() {
    this.location.back();
  }
  async ngAfterViewInit() {
    try {
      const player: Player = videojs(this.id, {
        autoplay: 'muted',
        loop: true
      });
      const url: string = (await this.requestService.connectChannel(this.id.substring(9))).url;
      player.src({
        src: url,
        type: 'application/x-mpegURL'
      });
    }
    catch (err) {
      console.log(err);
      await Swal.fire({
        title: 'server error',
        icon: 'error',
        text: "couldn't load camera, try again later"
      });
    }
  }
  ngOnDestroy(): void {
    const player: Player = videojs.getPlayer(this.id);
    if (player) {
      player.dispose();
    }
  }

  async record() {
    try {
      this.recording = !this.recording;
      let res: string;
      if (this.recording) {
        res = await this.requestService.startChannelRecording(this.id.substring(9));
        if (res == "success") {
          this.recording = true;
        }
      }
      else {
        res = await this.requestService.stopChannelRecording(this.id.substring(9));
        if (res == "success") {
          this.recording = false;
        }
      }
    }
    catch (err) {
      await Swal.fire({
        title: 'server error',
        icon: 'error',
        text: "couldn't record camera, try again later"
      });
    }
  }
}
