import { Component, OnInit } from '@angular/core';
import { Tournament } from 'src/app/interfaces/tournament';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { Team } from 'src/app/interfaces/team';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  tournament: Tournament = null;
  teams: Team[];
  docId: string;
  constructor(private route: ActivatedRoute, public firebaseService: FirebaseService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('draftId');
      this.firebaseService.getTournamentById(id).subscribe(t => {
        this.tournament = t.payload.data();
        this.tournament.docId = id;
        this.updateTeams();
      });
    });
  }

  updateTeams(): void {
    this.teams = [];
    this.firebaseService.getUsers().subscribe(users => {
      users.forEach(user => {
        const addUser = new Team();
        addUser.email = user.payload.doc.data().email;
        addUser.id = user.payload.doc.id;
        this.teams.push(addUser);
      });
      this.firebaseService.getTournamentTeams(this.tournament.docId).subscribe(teams => {
        teams.forEach(team => {
          this.teams.forEach(fTeam => {
            if (fTeam.email === team.payload.doc.data().captain) {
              fTeam.inDraft = true;
              fTeam.docId = team.payload.doc.id;
            }
          });
        });
      });
    });
  }

  addTeamToDraft(team: Team) {
    this.firebaseService.addTeamToDraft(team.email, this.tournament.docId);
    this.updateTeams();
  }

  removeTeamFromDraft(team: Team) {
    this.firebaseService.removeTeamFromDraft(team.docId, this.tournament.docId);
    this.updateTeams();
  }
}
