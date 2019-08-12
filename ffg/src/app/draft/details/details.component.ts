import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { Draft } from 'src/app/interfaces/firebase/Draft';
import { User } from 'firebase';
import { Team } from 'src/app/interfaces/team';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  draft: Draft = null;
  draftId: string;
  users;
  draftOrder: Team[];
  draftStarted: false;

  constructor(private route: ActivatedRoute, private router: Router, private firebaseService: FirebaseService) {
    this.users = this.firebaseService.getUsers();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.draftId = params.get('draftId');
      this.firebaseService.getDraftById(this.draftId).subscribe(draft => {
        if (draft) {
          this.draft = draft;
        } else {
          this.router.navigate(['/draft']);
        }
      });
    });
  }

  startDraft(): void {
    this.firebaseService.getDraftTeams(this.draftId).subscribe(teams => {
      this.draftOrder = teams;
      this.shuffleTeams();
      this.firebaseService.startDraft(this.draftId).finally(() => {
        console.log(this.draftOrder);
      });
    });
  }

  shuffleTeams() {
    const copy = [];
    let n = this.draftOrder.length;
    let i;
    while (n) {
      i = Math.floor(Math.random() * this.draftOrder.length);
      if (i in this.draftOrder) {
        copy.push(this.draftOrder[i]);
        delete this.draftOrder[i];
        n--;
      }
    }

    this.draftOrder = copy;
  }
}
