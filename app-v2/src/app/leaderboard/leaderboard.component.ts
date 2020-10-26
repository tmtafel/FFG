import { Component, OnInit } from '@angular/core';

import { Competition, EspnConvert } from '../interfaces/Espn';
import { EspnService } from '../services/espn/espn.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: Competition = null;

  constructor(private espnService: EspnService) {
  }

  ngOnInit(): void {
    this.espnService.getCurrentSitemap().then(stmp => {
      const tournamentId = stmp.tournaments.pop().id;
      const season = stmp.season;
      this.espnService.getTournament(season, tournamentId).subscribe(espn => {
        const evt = EspnConvert.toEspnEventData(espn.json);
        const competition = evt.competitions[0];
        competition.competitors.sort((a, b) => a.sortOrder - b.sortOrder);
        this.leaderboard = competition;
      });
    });
  }
}
