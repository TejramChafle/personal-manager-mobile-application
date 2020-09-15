import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, take, catchError } from 'rxjs/operators';
import { AppProvider } from '../../app/app.provider';
import { FIREBASE_CONFIG } from '../../app/app.config';
import { AuthProvider } from '../auth/auth.provider';
/*
  Generated class for the AppProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()

export class EventsProvider {
    registrationId: string;
    auth = new BehaviorSubject<any>(null);

    constructor(
      private _http: HttpClient, 
      private _appService: AppProvider,
      private _authProvider: AuthProvider) { }

    public composeEvent(params): Observable<any> {
      const data = { ...params, created_by: this._authProvider.user.user.id }
        return this._http.post(FIREBASE_CONFIG.API_KEY + 'events', data).pipe(
            tap((response) => {
                console.log('event response', response);
            }),
            catchError((error) => {
                console.log(error);
                // return throwError(error);
                this._appService.handleError(error);
                return error;
            })
        )
    }

    public getEvents(params): Observable<any> {
        return this._http.get(FIREBASE_CONFIG.API_KEY + 'events', params).pipe(
            tap((auth) => {
                this.auth.next(auth);
            }),
            catchError((error) => {
                // return throwError(error);
                return error;
            })
        )
    }

}
