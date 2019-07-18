import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { ConvertPgaData, PGAData } from '../interfaces/PgaData';
import { ConvertSchedule, ScheduleData } from '../interfaces/ScheduleData';

@Injectable({
  providedIn: 'root'
})
export class PgatourService {
  private scheduleUrl = 'https://statdata.pgatour.com/r/current/schedule-v2.json';

  constructor(private http: HttpClient) { }


  getStatistics(tournamentId: any): Observable<PGAData> {
    this.log('fetching statistics....');
    return this.http.get<PGAData>('https://statdata.pgatour.com/r/' + tournamentId.toString() + '/leaderboard-v2mini.json')
      .pipe(
        map(json => ConvertPgaData.toPGAData(JSON.stringify(json))),
        tap(_ => this.log('fetched statistics')),
        catchError(this.handleError<PGAData>('getStatistics'))
      );
  }

  getSchedule(): Observable<ScheduleData> {
    return this.http.get<ScheduleData>(this.scheduleUrl)
      .pipe(
        map(json => ConvertSchedule.toScheduleData(JSON.stringify(json))),
        tap(_ => this.log('fetched schedule')),
        catchError(this.handleError<ScheduleData>('getSchedule'))
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
