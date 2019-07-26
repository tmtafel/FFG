import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User } from 'firebase';
import { Tournament } from 'src/app/interfaces/tournament';
import { Trn } from 'src/app/interfaces/ScheduleData';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) { }

  getTournamentDocuments(): Observable<DocumentChangeAction<Tournament>[]> {
    return this.db.collection<Tournament>('tournaments').snapshotChanges();
  }

  getTournamentDocument(tournament: Trn): Observable<any> {
    return this.db.collection('tournaments', t => t
      .where('name', '==', tournament.trnName.official)
      .where('year', '==', tournament.year)
      .where('tId', '==', tournament.permNum))
      .snapshotChanges().pipe(map(t => t.length > 0 ? t[0] : null));
  }

  getTournamentById(draftId: string): Observable<Tournament> {
    return this.db.collection('tournaments').doc<Tournament>(draftId).valueChanges();
  }

  createDraft(tournament: Trn): void {
    this.getTournamentDocument(tournament).subscribe(trn => {
      if (trn === null) {
        const t = new Tournament(tournament.trnName.official, tournament.year, tournament.permNum);
        this.db.collection('/tournaments').add(t.getDocumentObject());
      }
    });
  }

      rToDraft(draftId: string, userId: string): void {
    this.getTournamentById(draftId).subscribe(draft => {
        console.log(draft);
    });
  }

  getUsers(): Observable<User[]> {
    return this.db.collection<User>('users').valueChanges();
  }

  createUser(value): void {
    this.db.collection('users').add({
      name: value.name
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`PGA Tour Service: ${message}`);
  }
}
