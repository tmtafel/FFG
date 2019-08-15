import { Component, OnInit } from '@angular/core';
import { Trn } from 'src/app/interfaces/ScheduleData';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { PgatourService } from 'src/app/services/pgatour/pgatour.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Draft } from 'src/app/interfaces/firebase/Draft';
import { Router } from '@angular/router';
import { DocumentChangeAction } from '@angular/fire/firestore';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  upcomming: Trn[];
  drafts: DocumentChangeAction<Draft>[];

  // tslint:disable-next-line:max-line-length
  constructor(public firebaseService: FirebaseService, private pgatourService: PgatourService, private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
    this.firebaseService.getAllDrafts().subscribe(drafts => {
      this.drafts = drafts;
    });
  }

  open(content) {
    this.upcomming = [];
    this.pgatourService.getScheduleData().subscribe(schedule => {
      const year = schedule.years.filter(y => y.year === schedule.currentYears.r)[0];
      const tour = year.tours.filter(y => y.tourCodeLc === 'r')[0];
      const trns = tour.trns.filter(t => t.primaryEvent === 'Y');
      const ids = this.drafts.map(d => d.payload.doc.id);
      const tournaments = trns.filter(trn => !ids.includes(trn.permNum));
      const now = new Date(Date.now());
      tournaments.map(trn => {
        if (new Date(trn.date.start) > now) {
          this.upcomming.push(trn);
        }
      });
      this.modalService.open(content, { size: 'lg' });
    });
  }

  createNewDraft(tournament: Trn) {
    this.firebaseService.createDraft(tournament).finally(() => {
      console.log('finished');
    });
    this.modalService.dismissAll();
  }

}
