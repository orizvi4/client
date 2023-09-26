import { Location } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { RequestService } from 'src/common/services/request.service';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements AfterViewInit, OnInit {
  constructor(private requestService: RequestService, private location: Location) {}

  @Input() id: string = '';
  @Input() recording: boolean = false;
  zoom: boolean = false;

  ngOnInit(): void {
    if (this.id == '') {
      this.id = "channelId" + (history.state).id;
      this.zoom = true;
    }
  }
  async back() {
    await this.requestService.stopChannelRecording(this.id.substring(9));
    this.location.back();
  }
  async ngAfterViewInit() {
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
  ngOnDestroy(): void {
    const player: Player = videojs.getPlayer(this.id);
    if (player) {
      player.dispose();
    }
  }
  async record() {
    this.recording = !this.recording;
    if (this.recording) {
      await this.requestService.startChannelRecording(this.id.substring(9));
    }
    else {
      await this.requestService.stopChannelRecording(this.id.substring(9));
    }
  }
}
