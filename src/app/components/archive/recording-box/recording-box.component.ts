import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { RecordingDTO } from 'src/common/models/recordingDTO.interface';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-recording-box',
  templateUrl: './recording-box.component.html',
  styleUrls: ['./recording-box.component.scss']
})
export class RecordingBoxComponent implements AfterViewInit, OnDestroy {

  @Input() recording!: RecordingDTO;
  @Output() deleteRecording: EventEmitter<string> = new EventEmitter<string>();

  ngAfterViewInit(): void {
    const player: Player = videojs(this.recording._id, {
      autoplay: 'muted',
      controls: true,
      loop: true
    });
    player.src({
      src: this.recording.link,
      type: 'application/x-mpegURL'
    });
  }

  ngOnDestroy(): void {
    const player: Player = videojs.getPlayer(this.recording._id);
    player.dispose();
  }

  delete() {
    this.deleteRecording.emit(this.recording.link);
  }
}
