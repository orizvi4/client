import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { RequestService } from 'src/common/services/request.service';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss', '../../../../../node_modules/video.js/dist/video-js.min.css']
})
export class CameraComponent implements OnInit {
  constructor(private requestService: RequestService) {}

  @Input() id: string = '';
  @ViewChild('temp', {
    static: true
  }) video!: ElementRef;

  async ngOnInit() {
    this.video.nativeElement.id = this.id;
    const player: Player = videojs(this.id, {
      fluid: true,
      autoplay: 'muted'
    });
    const url: string = (await this.requestService.connectChannel(this.id.substring(9))).url;
    console.log(this.id.substring(9));
    player.src({
      src: url,
      // src: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
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
