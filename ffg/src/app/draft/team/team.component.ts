import { Component, OnInit, Input } from '@angular/core';
import { User } from 'firebase';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  @Input() user: User;
  draftId: string;
  inDraft = false;
  removingUser = false;
  addingUser = false;
  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.draftId = params.get('draftId');
      this.firebaseService.isUserInDraft(this.user, this.draftId).subscribe(userInDraft => {
        this.inDraft = userInDraft;
      });
    });
  }

  addToDraft() {
    this.addingUser = true;
    this.firebaseService.addUserToDraft(this.user, this.draftId).finally(() => {
      this.addingUser = false;
    });
  }

  removeFromDraft() {
    this.removingUser = true;
    this.firebaseService.getTeamId(this.user, this.draftId).subscribe(id => {
      if (id) {
        this.firebaseService.removeUserFromDraft(id, this.draftId).finally(() => {
          this.removingUser = false;
        });
      }
    });
  }
}
