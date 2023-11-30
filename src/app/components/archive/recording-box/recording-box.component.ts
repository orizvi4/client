import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-recording-box',
  templateUrl: './recording-box.component.html',
  styleUrls: ['./recording-box.component.scss']
})
export class RecordingBoxComponent {
  @Input() key!: string;
  @Input() value!: string;
  @Output() deleteRecording: EventEmitter<string> = new EventEmitter<string>();

  delete() {
    this.deleteRecording.emit(this.value);
  }
}
