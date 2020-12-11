import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Espn } from '../inferfaces/espn';
import { Sitemap } from '../inferfaces/sitemap';

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
    return new Promise(async (resolve, reject) => {
      try {
        this.sitemaps.subscribe(stmps => {
          const result = stmps.sort((a, b) => a.season - b.season).pop();
          resolve(result);
        });
      } catch (err) {
        reject(err);
      }
    });

  }
}
