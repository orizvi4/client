import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.scss']
})
export class RoomsListComponent {
  @Input() sideNavStatus:boolean = false;
  rooms: string[] = ["tjfgvjf","fdfdfd", "fdsdfgred", "gfvgff", "GFgfrf", "fdffd"];
}
