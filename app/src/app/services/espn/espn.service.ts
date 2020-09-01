import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EspnData } from 'src/app/interfaces/EspnData';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EspnService {
  private url = 'https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga';
  constructor(private http: HttpClient) { }

  getLeaderbaord(): Observable<EspnData> {
    return this.http.get<EspnData>(this.url)
      .pipe(
        map(json => json),
        tap(_ => this.log('fetched statistics')),
        catchError(this.handleError<EspnData>('getStatistics'))
      );
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
