import { Component } from '@angular/core';
import { Constants } from 'src/common/constants';

@Component({
  selector: 'app-logs-display',
  templateUrl: './logs-display.component.html',
  styleUrls: ['./logs-display.component.scss']
})
export class LogsDisplayComponent {
  kibana: string = Constants.KIBANA;
}
