import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Trn } from '../interfaces/ScheduleData';
import { map, tap, catchError } from 'rxjs/operators';
import { Tournament } from '../interfaces/tournament';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) { }

  getTournaments(): Observable<DocumentChangeAction<any>[]> {
    return this.db.collection('tournaments').snapshotChanges();
  }

  getTournament(tournament: Trn): Observable<any> {
    return this.db.collection('tournaments', t => t
      .where('name', '==', tournament.trnName.official)
      .where('year', '==', tournament.year))
      .valueChanges().pipe(map(t => t.length > 0 ? t[0] : null));
  }

  getTournamentId(tournament: Trn): Observable<string> {
    return this.getTournament(tournament).pipe(map(trn => trn[0].payload.doc.id));
  }

  createTournament(tournament: Trn): void {
    this.getTournament(tournament).subscribe(trn => {
      if (trn === null) {
        const t = new Tournament(tournament);
        this.db.collection('/tournaments').add(t.getObject());
      }
    });
  }


  getUsers(): Observable<any> {
    return this.db.collection('users').snapshotChanges();
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
