import { Component, OnInit } from '@angular/core';
import { PgatourService } from 'src/app/services/pgatour/pgatour.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { Leaderboard } from 'src/app/interfaces/PgaData';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})

export class LeaderboardComponent implements OnInit {
  leaderboard: Leaderboard = null;
  year: number;
  constructor(public firebaseService: FirebaseService, private pgatourService: PgatourService) { }

  ngOnInit() {
    this.getLeaderboard();
  }

  getLeaderboard(): void {
    this.pgatourService.getScheduleData().subscribe(schedule => {
      const currentWeek = schedule.thisWeek.weekNumber;
      const year = schedule.years.filter(y => y.year === schedule.currentYears.r)[0];
      const tour = year.tours.filter(y => y.tourCodeLc === 'r')[0];
      const tournament = tour.trns.filter(t => t.primaryEvent === 'Y' && t.date.weekNumber === currentWeek)[0];
      if (tournament !== null) {
        this.pgatourService.getLeaderbaord(tournament.permNum).subscribe(statData => {
          console.log(statData);
          this.leaderboard = statData.leaderboard;
        });
      }
    });
  }
}
