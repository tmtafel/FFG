import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {  } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Convert, Espn, EspnData } from 'src/app/interfaces/Espn';
import { Sitemap, SitemapTournament } from 'src/app/interfaces/Sitemap';

@Injectable({
  providedIn: 'root'
})
export class EspnService {
  constructor(public db: AngularFirestore) { }

  public async getCurrentTournament(): Promise<EspnData> {
    const sitemap$ = this.getCurrentSitemap();
    this.categories = await firstValueFrom(sitemap$);
  }
  getCurrentTournament(): Promise<EspnData> {
    return this.getCurrentSitemap().pipe(map(sitemap => {
      const current = sitemap.tournaments.filter(trn => !trn.completed)[0];
      if (typeof (current) !== 'undefined' && current !== null) {
        return this.getTournament(current.id).pipe(map(e => {
          return e;
        }));
      }
      return null;
    }));
  }
  getTournament(id: number): Observable<EspnData> {
    const year = new Date(Date.now()).getFullYear();
    return this.db.doc<Espn>(`tournaments/${year}/events/${id}`)
      .get()
      .pipe(map(trnDoc => {
        const trnData = trnDoc.data() as ;
        const espnData = Convert.toEspnData(trnDoc.data());
        return espnData;
      }));
  }

  getCurrentSitemap(): Observable<Sitemap> {
    const year = new Date(Date.now()).getFullYear();
    return this.db.doc<Sitemap>(`tournaments/${year}`)
      .valueChanges();
  }
}
