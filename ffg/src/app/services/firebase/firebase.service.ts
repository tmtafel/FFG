import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trn } from 'src/app/interfaces/ScheduleData';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserResponse } from 'src/app/interfaces/UserResponse';
import { Draft } from 'src/app/interfaces/firebase/Draft';
import { Team } from 'src/app/interfaces/team';
import { User } from 'firebase';
import { PgatourService } from '../pgatour/pgatour.service';
import { Player } from 'src/app/interfaces/PgaData';
import { forEach } from '@angular/router/src/utils/collection';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*'
  })
};
@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(public db: AngularFirestore, public auth: AuthService, private http: HttpClient, private pgaTourService: PgatourService) {
  }

  getUsers() {
    // tslint:disable-next-line:max-line-length
    return this.http.get<UserResponse>('https://us-central1-ffgolf.cloudfunctions.net/getAllUsers', httpOptions).pipe(map(res => res.users));
  }
  getAllDrafts(): Observable<DocumentChangeAction<Draft>[]> {
    return this.db.collection<Draft>('draft').snapshotChanges();
  }

  getDraftById(id: string): Observable<Draft> {
    return this.db.collection('draft').doc<Draft>(id).valueChanges();
  }

  getDraftTeams(draftId: string): Observable<Team[]> {
    return this.db.collection('draft').doc(draftId).collection<Team>('teams').valueChanges();
  }

  getDraft(tournament: Trn): Observable<Draft> {
    return this.db.collection<Draft>('draft', t => t
      .where('name', '==', tournament.trnName.official)
      .where('year', '==', tournament.year)
      .where('tId', '==', tournament.permNum))
      .valueChanges().pipe(map(t => t.length > 0 ? t[0] : null));
  }

  async createDraft(tournament: Trn) {
    const t = new Draft(tournament);
    await this.db.collection('draft').add(t.getDocumentObject()).then(result => {
      this.getUsers().subscribe(users => {
        users.forEach(async user => {
          await this.addUserToDraft(user, result.id);
        });
      });
      this.pgaTourService.getPlayersForTournament(t.id).subscribe(async players => {
        players.forEach(async player => {
          await this.addPlayerToDraft(player, result.id);
        });
      });
    });
  }

  getTeamId(user: User, draftId: string): Observable<string> {
    return this.db.collection('draft').doc(draftId).collection('teams', t => t
      .where('uid', '==', user.uid)).snapshotChanges().pipe(map(r => r.length > 0 ? r[0].payload.doc.id : null));
  }

  async addUserToDraft(user: User, draftId: string) {
    await this.db.collection('draft').doc(draftId).collection('teams').add({
      email: user.email,
      uid: user.uid,
      name: user.displayName ? user.displayName : ''
    });
  }

  async removeUserFromDraft(userId: string, draftId: string) {
    await this.db.collection('draft').doc(draftId).collection('teams').doc(userId).delete();
  }

  isUserInDraft(user: User, draftId: string): Observable<boolean> {
    return this.db.collection('draft').doc(draftId).collection('teams', t => t
      .where('uid', '==', user.uid))
      .valueChanges().pipe(map(t => t.length > 0));
  }

  async addPlayerToDraft(player: Player, draftId: string) {
    await this.db.collection('draft').doc(draftId).collection('players').add({
      firstName: player.player_bio.first_name,
      lastName: player.player_bio.last_name,
      id: player.player_id
    });
  }

  async startDraft(draftId: string) {
    await this.db.collection('draft').doc(draftId).set({
      startHasDraft: true
    });
  }
}
