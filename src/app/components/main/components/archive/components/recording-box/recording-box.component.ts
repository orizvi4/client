import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { RecordingDTO } from 'src/common/models/recordingDTO.interface';
import videojs from 'video.js';

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
  player?: any;

  ngOnInit(): void {
    this.startDate = new Date(this.recording.startAt.toString().slice(0, -1)).toLocaleString();
    this.endDate = new Date(this.recording.endAt.toString().slice(0, -1)).toLocaleString();
  }

  ngAfterViewInit(): void {
    this.player = videojs(this.recording._id, {
      autoplay: 'muted',
      controls: true,
      loop: true
    });
    this.player.src({
      src: this.recording.link,
      type: 'application/x-mpegURL'
    });
  }

  ngOnDestroy(): void {//closes before finsish
    this.player.dispose();
  }

  public async delete() {
    this.deleteRecording.emit(this.recording.link);
  }
}
