import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-room-box',
  templateUrl: './room-box.component.html',
  styleUrls: ['./room-box.component.scss']
})
export class RoomBoxComponent {
  @Input() name: string = '';
}
