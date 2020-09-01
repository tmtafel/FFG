import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, pipe } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PGAData, Player } from 'src/app/interfaces/PgaData';
import { ConvertSchedule, ScheduleData, Trn } from 'src/app/interfaces/ScheduleData';

@Injectable({
  providedIn: 'root'
})
export class PgatourService {
  private scheduleUrl = 'https://statdata.pgatour.com/r/current/schedule-v2.json';

  constructor(private http: HttpClient) { }

  getLeaderbaord(tournamentId: any): Observable<PGAData> {
    debugger;
    return this.http.get<PGAData>('https://statdata.pgatour.com/r/' + tournamentId.toString() + '/leaderboard-v2mini.json')
      .pipe(
        map(json => json),
        tap(_ => this.log('fetched statistics')),
        catchError(this.handleError<PGAData>('getStatistics'))
      );
  }

  getPlayersForTournament(tournamentId: any): Observable<Player[]> {
    return this.getLeaderbaord(tournamentId)
      .pipe(
        map(leaderboard => leaderboard.leaderboard.players),
        tap(_ => this.log('fetched schedule data')),
        catchError(this.handleError<Player[]>('getScheduleData'))
      );
  }

  getScheduleData(): Observable<ScheduleData> {
    return this.http.get<ScheduleData>(this.scheduleUrl)
      .pipe(
        map(json => json),
        tap(_ => this.log('fetched schedule data')),
        catchError(this.handleError<ScheduleData>('getScheduleData'))
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
