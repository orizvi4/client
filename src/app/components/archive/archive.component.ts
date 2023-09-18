import { AfterViewInit, Component, OnDestroy, OnInit, resolveForwardRef } from '@angular/core';
import { FilterDTO } from 'src/common/models/filterDTO.iterface';
import { RecordingDTO } from 'src/common/models/recordingDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private requestService: RequestService) { }
  streams: Map<string, string> = new Map<string, string>([]);

  async ngOnInit() {
    const filter: FilterDTO = { startAt: new Date("2023-09-12 14:03:32.346Z"), endAt: new Date("2023-09-12 14:04:34.045Z") };
    const recordings: string[] = await this.requestService.getRecordings(filter);
    for (let i = 0; i < recordings.length; i++) {
      this.streams.set("record" + i, recordings[i]);
    }
  }
  async ngAfterViewInit() {
    await this.ngOnInit();
    for (const stream of this.streams) {
      const player: Player = videojs(stream[0], {
        autoplay: 'muted',
        controls: true,
        loop: true
      });
      player.src({
        src: stream[1],
        type: 'application/x-mpegURL'
      });
    }
  }
  ngOnDestroy(): void {
    for (const stream of this.streams) {
      const player: Player = videojs.getPlayer(stream[0]);
      player.dispose();
    }
  }

}
