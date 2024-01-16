import { Location } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AxiosError } from 'axios';
import { ChannelDTO } from 'src/common/models/channelDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import { WebSocketService } from 'src/common/services/web-socket.service';
import Swal from 'sweetalert2';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements AfterViewInit, OnInit {
  constructor(private requestService: RequestService,
    private location: Location,
    private websocketService: WebSocketService
  ) {
    this.websocketService.getChannelUpdate$().subscribe(async (next: ChannelDTO) => {
      if (this.id == "channelId" + next._id) {
          this.live = next.isLive;
          // if (this.live == false) {
          //   const player = videojs.getPlayer(this.id);
          //   player.on("progress", () => {
          //     setTimeout(() => {
          //       player.load();
          //     }, 5000);
          //   });
          // }
      }
    });
  }

  @Input() id: string = '';
  @Input() recording: boolean = false;
  live: boolean = false;
  zoom: boolean = false;
  deviceName: string = '';

  public async ngOnInit(): Promise<void> {
    if (this.id == '') {
      this.id = "channelId" + (history.state).id;
      this.zoom = true;
    }
    const channel: ChannelDTO = await this.requestService.getChannel(this.id.substring(9));
    this.recording = channel.isRecording;
    this.live = channel.isLive;
    this.deviceName = channel.device.title;
  }

  public async back() {
    this.location.back();
  }

  public async ngAfterViewInit() {
    try {
      const player = videojs(this.id, {
        autoplay: 'muted',
        loop: true
      });
      const url: string = (await this.requestService.connectChannel(this.id.substring(9))).url;
      player.src({
        src: url,
        type: 'application/x-mpegURL'
      });
      // player.on('waiting', async () => {
      //   console.log("grwgwrg");
      //   setTimeout(() => {
      //     // const url: string = (await this.requestService.connectChannel(this.id.substring(9))).url;
      //     // player.src({
      //     //   src: url,
      //     //   type: 'application/x-mpegURL'
      //     // });
      //     player.load();

      //   }, 5000);
      // });
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

  public async record() {
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
