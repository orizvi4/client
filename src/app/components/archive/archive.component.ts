import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('startTime') startTime!: ElementRef;
  @ViewChild('endTime') endTime!: ElementRef;
  streams: Map<string, string> = new Map<string, string>([]);

  async filterRecordings() {
    for (const stream of this.streams) {
      const player: Player = videojs.getPlayer(stream[0]);
      player.dispose();
      this.streams.delete(stream[0]);
    }
    const filter: FilterDTO = { startAt: this.startTime.nativeElement.value, endAt: this.endTime.nativeElement.value };
    const recordings: string[] = await this.requestService.getRecordings(filter);
    for (let i = 0; i < recordings.length; i++) {
      this.streams.set("record" + i, recordings[i]);
    }
    setTimeout(() => {
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
  }, 0);
  }

  async ngOnInit() {
    const recordings: string[] = await this.requestService.getRecordings();
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
