import { Component, OnInit } from '@angular/core';
import { Leaderboard } from '../../interfaces/Leaderboard';
import { PgatourService } from '../../services/pgatour.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})

export class LeaderboardComponent implements OnInit {
  leaderboardReady = false;
  leaderboard: Leaderboard = null;
  lastUpdated: Date = null;
  tournamentName: string;
  constructor(private pgatourService: PgatourService) { }

  ngOnInit() {
    this.getLeaderboard();
  }

  getLeaderboard(): void {
    this.pgatourService.getStatistics().subscribe(statData => {
      this.lastUpdated = statData.last_updated;
      this.leaderboard = statData.leaderboard;
      this.tournamentName = statData.leaderboard.tournament_name;
      this.leaderboardReady = true;
    });
  }
}
