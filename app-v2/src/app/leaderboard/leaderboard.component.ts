import { Component, OnInit } from '@angular/core';

import { EspnData } from '../interfaces/Espn';
import { EspnService } from '../services/espn/espn.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: EspnData = null;
  constructor(private espnService: EspnService) { }

  ngOnInit(): void {
    this.espnService.getCurrentSitemap().then(trn => {
      console.log(trn);
      // this.espnService.getTournament(id).subscribe(data => {
      //   this.leaderboard = data;
      //   console.log(data);
      // });
    });
  }
}
