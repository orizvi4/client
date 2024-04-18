import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { StrikeDTO } from './models/strikeDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import { UserDTO } from 'src/common/models/userDTO.interface';

@Component({
  selector: 'app-user-strike',
  templateUrl: './user-strike.component.html',
  styleUrls: ['./user-strike.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserStrikeComponent implements OnInit {

  constructor(private requestService: RequestService) {}

  @Input() user!: UserDTO;
  panelty: number = 0;
  relevantStrikes: StrikeDTO[] = [];
  irrelevantStrikes: StrikeDTO[] = [];
  columnsToDisplay = ['strike', 'time'];

  public async ngOnInit(): Promise<void> {
    try {
      const strikes: StrikeDTO[] = await this.requestService.getUserStrikes(this.user.givenName);
      for (const strike of strikes) {
        strike.time = strike.time.substring(0, 16);
        strike.time = strike.time.replace('T', ' ');
      }
      this.relevantStrikes = strikes.filter((strike) => strike.relevant === true);
      this.irrelevantStrikes = strikes.filter((strike) => strike.relevant === false);
      this.panelty = await this.requestService.getUserPanelty(this.user.givenName);
    }
    catch (err) {
      console.log(err);
    }
  }

  public async resetPanelty() {
    try {
      await this.requestService.resetPanelty(this.user.givenName);
      this.panelty = 0;
      this.irrelevantStrikes = this.irrelevantStrikes.concat(this.relevantStrikes);
      this.relevantStrikes = [];
    }
    catch (err) {
      console.log(err);
    }
  }
}
