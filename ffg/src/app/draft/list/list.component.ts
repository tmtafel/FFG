import { Component, OnInit } from '@angular/core';
import { Trn } from 'src/app/interfaces/ScheduleData';
import { Tournament } from 'src/app/interfaces/tournament';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { PgatourService } from 'src/app/services/pgatour/pgatour.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  upcomming: Trn[] = [];
  past: Trn[] = [];
  drafts: Tournament[] = [];

  constructor(public firebaseService: FirebaseService, private pgatourService: PgatourService, private modalService: NgbModal) { }

  ngOnInit() {
    this.getTournamentDocuments();
  }

  getAllTournaments(): void {
    this.pgatourService.getScheduleData().subscribe(schedule => {
      const year = schedule.years.filter(y => y.year === schedule.currentYears.r)[0];
      const tour = year.tours.filter(y => y.tourCodeLc === 'r')[0];
      const trns = tour.trns.filter(t => t.primaryEvent === 'Y');
      const ids = this.drafts.map(d => d.tId);
      const tournaments = trns.filter(trn => !ids.includes(trn.permNum));
      const now = new Date(Date.now());
      tournaments.map(trn => {
        if (new Date(trn.date.start) > now) {
          this.upcomming.push(trn);
        } else {
          this.past.push(trn);
        }
      });

    });
  }

  getTournamentDocuments(): void {
    this.firebaseService.getTournamentDocuments().subscribe(tDocuments => {
      tDocuments.forEach(tDoc => {
        const docId = tDoc.payload.doc.id;
        const tournament = tDoc.payload.doc.data();
        tournament.docId = docId;
        this.drafts.push(tournament);
      });
    });
  }

  createNewDraft(tournament: Trn) {
    this.firebaseService.createDraft(tournament);
  }

  open(content) {
    this.getAllTournaments();
    this.modalService.open(content, { size: 'lg' });
  }

}
