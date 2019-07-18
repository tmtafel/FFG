import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DraftService {

  constructor(public db: AngularFirestore) { }

  getTeams(): Observable<any[]> {
    return this.db.collection('/tournaments').valueChanges();
  }

  addTournament(tournamentName) {
    return this.db.collection('tournaments').add({
      name: tournamentName,
    });
  }
}
