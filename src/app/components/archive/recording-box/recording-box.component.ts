import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-recording-box',
  templateUrl: './recording-box.component.html',
  styleUrls: ['./recording-box.component.scss']
})
export class RecordingBoxComponent implements AfterViewInit, OnDestroy {
  @Input() key!: string;
  @Input() value!: string;
  @Output() deleteRecording: EventEmitter<string> = new EventEmitter<string>();

  ngAfterViewInit(): void {
    const player: Player = videojs(this.key, {
      autoplay: 'muted',
      controls: true,
      loop: true
    });
    player.src({
      src: this.value,
      type: 'application/x-mpegURL'
    });
  }

  ngOnDestroy(): void {
    const player: Player = videojs.getPlayer(this.key);
    player.dispose();
  }

  delete() {
    this.deleteRecording.emit(this.value);
  }
}
