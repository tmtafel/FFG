import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firstValueFrom, Observable } from 'rxjs';
import { Espn } from 'src/app/interfaces/Espn';
import { Sitemap } from 'src/app/interfaces/Sitemap';

@Injectable({
  providedIn: 'root'
})
export class EspnService {

  private sitemaps: Observable<Sitemap[]>;

  constructor(public db: AngularFirestore) {
    this.sitemaps = this.db.collection<Sitemap>(`tournaments`).valueChanges();
  }


  getTournament(season: number, id: number): Observable<Espn> {
    return this.db.doc<Espn>(`tournaments/${season}/events/${id}`).valueChanges();
  }

  async getCurrentSitemap(): Promise<Sitemap> {
    const sitemaps = await firstValueFrom(this.sitemaps);
    sitemaps.sort((a, b) => a.season - b.season);
    console.log(sitemaps);
    return sitemaps.pop();
  }
}
