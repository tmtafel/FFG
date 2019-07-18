import { Component, OnInit } from '@angular/core';
import { PgatourService } from '../../services/pgatour.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Leaderboard } from 'src/app/interfaces/PgaData';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})

export class LeaderboardComponent implements OnInit {
  leaderboardReady = false;
  leaderboard: Leaderboard = null;
  year: number;
  constructor(public firebaseService: FirebaseService, private pgatourService: PgatourService) { }

  ngOnInit() {
    this.getLeaderboard();
  }

  getLeaderboard(): void {
    this.pgatourService.getSchedule().subscribe(schedule => {
      console.log(schedule);
    });
    // this.pgatourService.getStatistics().subscribe(statData => {
    //   console.log(statData);
    //   this.leaderboard = statData.Leaderboards[0];
    //   this.leaderboardReady = true;
    // });
  }
}
