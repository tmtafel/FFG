import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Convert, StatJson, CourseJson } from '../interfaces/PgaData';

@Injectable({
  providedIn: 'root'
})
export class PgatourService {

  private statsUrl = 'https://statdata.pgatour.com/r/current/leaderboard-v2mini.json';
  private courseUrl = 'https://www.pgatour.com/content/dam/pgatour/json/tournament/course.json';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getStatistics(): Observable<StatJson> {
    this.log('fetching statistics....');
    return this.http.get<StatJson>(this.statsUrl)
      .pipe(
        map(json => Convert.toStatData(JSON.stringify(json))),
        tap(_ => this.log('fetched statistics')),
        catchError(this.handleError<StatJson>('getLeaderboard'))
      );
  }

  getCourseData(): Observable<CourseJson> {
    return this.http.get<CourseJson>(this.courseUrl)
      .pipe(
        map(json => Convert.toCourseData(JSON.stringify(json))),
        tap(_ => this.log('fetched course')),
        catchError(this.handleError<CourseJson>('getCourseData'))
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
    this.messageService.add(`PGA Tour Service: ${message}`);
  }
}
