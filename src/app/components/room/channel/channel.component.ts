import { AfterViewInit, Component, Input } from '@angular/core';
import { RequestService } from 'src/common/services/request.service';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements AfterViewInit {
  constructor(private requestService: RequestService) {}

  @Input() id: string = '';
  async ngAfterViewInit() {
    const player: Player = videojs(this.id, {
      autoplay: 'muted',
    });
    // const url: string = (await this.requestService.connectChannel(this.id.substring(9))).url;
    player.src({
      // src: url,
      src: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
      type: 'application/x-mpegURL'
    });
  }
  ngOnDestroy(): void {
    const player: Player = videojs.getPlayer(this.id);
    if (player) {
      player.dispose();
    }
  }
}
