import { Component, Input, OnInit } from '@angular/core';
import { StrikeDTO } from './models/strikeDTO.interface';
import { RequestService } from 'src/common/services/request.service';

@Component({
  selector: 'app-user-strike',
  templateUrl: './user-strike.component.html',
  styleUrls: ['./user-strike.component.scss']
})
export class UserStrikeComponent implements OnInit {

  constructor(private requestService: RequestService) {}

  @Input() username: string = '';
  panelty: number = 0;
  strikes: StrikeDTO[] = [];

  public async ngOnInit(): Promise<void> {
    try {
      this.strikes = await this.requestService.getUserStrikes(this.username);
      this.panelty = await this.requestService.getUserPanelty(this.username);
    }
    catch (err) {
      console.log(err);
    }
  }

  public async resetPanelty() {
    try {
      await this.requestService.resetPanelty(this.username);
      this.panelty = 0;
    }
    catch (err) {
      console.log(err);
    }
  }
}
