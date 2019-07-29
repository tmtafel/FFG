import { Component, OnInit } from '@angular/core';
import { Tournament } from 'src/app/interfaces/tournament';
import { User } from 'firebase';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  tournament: Tournament = null;
  users: User[];
  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('draftId');
      this.firebaseService.getTournamentById(id).subscribe(t => {
        this.tournament = t;
      });
    });
  }

}
