import { Component, OnInit } from '@angular/core';
import { StatisticService } from '../services/statistic.service';
import { Convert, Leaderboard } from '../statData';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})

export class LeaderboardComponent implements OnInit {
  ready = false;
  leaderboard: Leaderboard = null;
  lastUpdated: Date = null;
  constructor(private statisticService: StatisticService) { }

  ngOnInit() {
    this.getStatData();
  }

  getStatData(): void {
    this.statisticService.getStatData().subscribe(json => {
      const ret = JSON.stringify(json);
      const statData = Convert.toStatData(ret);
      console.log(statData);
      this.lastUpdated = statData.last_updated;
      this.leaderboard = statData.leaderboard;
      this.ready = true;
    });
  }
}
