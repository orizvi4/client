import { Component, Input, OnInit } from '@angular/core';
import { StrikeDTO } from './models/strikeDTO.interface';
import { RequestService } from 'src/common/services/request.service';
import { UserDTO } from 'src/common/models/userDTO.interface';

@Component({
  selector: 'app-user-strike',
  templateUrl: './user-strike.component.html',
  styleUrls: ['./user-strike.component.scss']
})
export class UserStrikeComponent implements OnInit {

  constructor(private requestService: RequestService) {}

  @Input() user!: UserDTO;
  panelty: number = 0;
  strikes: StrikeDTO[] = [];

  public async ngOnInit(): Promise<void> {
    try {
      this.strikes = await this.requestService.getUserStrikes(this.user.givenName);
      for (const strike of this.strikes) {
        strike.time = strike.time.substring(0, 16);
        strike.time = strike.time.replace('T', ' ');
      }
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
    }
    catch (err) {
      console.log(err);
    }
  }
}
