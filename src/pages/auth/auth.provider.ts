import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, take, catchError } from 'rxjs/operators';
import { AppProvider } from '../../app/app.provider';
import { FIREBASE_CONFIG } from '../../app/app.config';
/*
  Generated class for the AppProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()

export class AuthProvider {
    registrationId: string;
    auth = new BehaviorSubject<any>(null);

    constructor(private _http: HttpClient, private _appService: AppProvider) { }


    public login(param): Observable<any> {
        const auth = { email: param.username, password: param.password, returnSecureToken: true };
        return this._http.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + FIREBASE_CONFIG.API_KEY, auth).pipe(
            tap((auth) => {
                // console.log('auth', auth);
                this.auth.next(auth);
            }),
            catchError((error) => {
                console.log(error);
                // return throwError(error);
                this._appService.handleError(error);
                return error;
            })
        )
    }

    public signup(params): Observable<any> {
        const auth = { email: params.email, password: params.password, returnSecureToken: true };
        return this._http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + FIREBASE_CONFIG.API_KEY, auth).pipe(
            tap((auth) => {
                this.auth.next(auth);
            }),
            catchError((error) => {
                // return throwError(error);
                return error;
            })
        )
    }

    public getUser(): Observable<any> {
        return this._http.post('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + FIREBASE_CONFIG.API_KEY, { idToken: this.user.idToken }).pipe(
            catchError((error) => {
                this._appService.handleError(error);
                // return throwError(error);
                return error;
            })
        )
    }

    public updateUser(params): Observable<any> {
        const data = {
            idToken: this.user.idToken,
            displayName: params.name,
            photoUrl: params.photoUrl,
            returnSecureToken: false
        }
        return this._http.post('https://identitytoolkit.googleapis.com/v1/accounts:update?key=' + FIREBASE_CONFIG.API_KEY, data).pipe(
            catchError((error) => {
                // return throwError(error);
                return error;
            })
        )
    }

    get user() {
        let user;
        this.auth.pipe(take(1)).subscribe((repsonse) => {
          if (repsonse) {
            localStorage.setItem('auth', JSON.stringify(repsonse));
            user = repsonse;
          } else {
            user = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : null;
          }
        });
        return user;
      }
    
      logout() {
        localStorage.clear();
        this.auth.next(null);
      }

}
