import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { PgatourService } from 'src/app/services/pgatour.service';
import { Trn } from '../../interfaces/ScheduleData';
import { Tournament } from 'src/app/interfaces/tournament';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.scss']
})
export class DraftComponent implements OnInit {
  tournaments: Trn[];

  constructor(public firebaseService: FirebaseService, private pgatourService: PgatourService) { }

  ngOnInit() {
    this.getTournaments();
  }

  getTournaments(): void {
    this.firebaseService.getTournaments().subscribe(trns => {
      this.pgatourService.getSchedule().subscribe(schedule => {
        schedule.years.forEach(sYear => {
          if (sYear.year === schedule.currentYears.r) {
            sYear.tours.forEach(sTour => {
              if (sTour.tourCodeLc === 'r') {
                this.tournaments = sTour.trns;
              }
            });
          }
        });
      });
    });
  }


  createNewDraft(tournament: Trn) {
    this.firebaseService.createTournament(tournament);
  }
}
