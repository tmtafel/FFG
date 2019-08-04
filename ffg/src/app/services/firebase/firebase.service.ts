import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tournament } from 'src/app/interfaces/tournament';
import { Trn } from 'src/app/interfaces/ScheduleData';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) { }

  getTournamentDocuments(): Observable<DocumentChangeAction<any>[]> {
    return this.db.collection('tournaments').snapshotChanges();
  }

  getTournamentById(draftId: string): Observable<any> {
    return this.db.collection('tournaments').doc(draftId).snapshotChanges();
  }

  getTournamentTeams(draftId: string): Observable<DocumentChangeAction<any>[]> {
    return this.db.collection('tournaments').doc(draftId).collection('teams').snapshotChanges();
  }

  getTournamentDocument(tournament: Trn): Observable<any> {
    return this.db.collection('tournaments', t => t
      .where('name', '==', tournament.trnName.official)
      .where('year', '==', tournament.year)
      .where('tId', '==', tournament.permNum))
      .snapshotChanges().pipe(map(t => t.length > 0 ? t[0] : null));
  }

  createDraft(tournament: Trn): void {
    this.getTournamentDocument(tournament).subscribe(trn => {
      if (trn === null) {
        const t = new Tournament(tournament.trnName.official, tournament.year, tournament.permNum);
        this.db.collection('/tournaments').add(t.getDocumentObject());
      }
    });
  }

  deleteDraft(draftId: string): void {
    this.db.collection('/tournaments').doc(draftId).delete();
  }

  addTeamToDraft(email: string, draftId: string): void {
    const captain = { captain: email };
    this.db.collection('tournaments').doc(draftId).collection('teams').add(captain);
  }

  removeTeamFromDraft(teamId: string, draftId: string): void {
    this.db.collection('tournaments').doc(draftId).collection('teams').doc(teamId).delete();
  }

  getUsers(): Observable<DocumentChangeAction<any>[]> {
    return this.db.collection('/users').snapshotChanges();
  }
}
