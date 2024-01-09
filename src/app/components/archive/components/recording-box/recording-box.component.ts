import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RecordingDTO } from 'src/common/models/recordingDTO.interface';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-recording-box',
  templateUrl: './recording-box.component.html',
  styleUrls: ['./recording-box.component.scss']
})
export class RecordingBoxComponent implements AfterViewInit, OnDestroy, OnInit {

  @Input() recording!: RecordingDTO;
  @Input() group!: string;
  @Output() deleteRecording: EventEmitter<string> = new EventEmitter<string>();
  startDate!: string;
  endDate!: string;

  ngOnInit(): void {
    this.startDate = new Date(this.recording.startAt.toString().slice(0, -1)).toLocaleString();
    this.endDate = new Date(this.recording.endAt.toString().slice(0, -1)).toLocaleString();
  }

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

  ngOnDestroy(): void {//closes before finsish
    const player: Player = videojs.getPlayer(this.recording._id);
    player.dispose();
  }

  delete() {
    this.deleteRecording.emit(this.recording.link);
  }
}
