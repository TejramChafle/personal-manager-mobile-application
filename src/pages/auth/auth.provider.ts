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
        /* const auth = { email: param.username, password: param.password, returnSecureToken: true };
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
        ) */

        const auth = { email: param.username, password: param.password };
        return this._http.post(FIREBASE_CONFIG.API_KEY + 'auth/login', auth).pipe(
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
        /* const auth = { email: params.email, password: params.password, returnSecureToken: true };
        return this._http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + FIREBASE_CONFIG.API_KEY, auth).pipe(
            tap((auth) => {
                this.auth.next(auth);
            }),
            catchError((error) => {
                // return throwError(error);
                return error;
            })
        ) */

        const auth = { name: params.name, email: params.email, password: params.password, device: params.device };
        return this._http.post(FIREBASE_CONFIG.API_KEY + 'auth/signup', auth).pipe(
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


    // Save device information on server
    public saveDeviceInformation(device): Observable<any> {
        return this._http.post(FIREBASE_CONFIG.API_KEY + 'push/save-device-information', device).pipe(
            tap((result) => {
                console.log(result);
                // TODO: Once the device token is registered, need to save in user devices
                alert('Device registered with this information: ' + JSON.stringify(result));
            }),
            catchError((error) => {
                // return throwError(error);
                return error;
            })
        )
    }

    public sendNotification(): Observable<any> {
        const auth = { user: this.user.user.id };
        return this._http.post(FIREBASE_CONFIG.API_KEY + 'push/send-notification', auth).pipe(
            tap((result) => {
                // this.auth.next(auth);
                console.log(result);
            }),
            catchError((error) => {
                // return throwError(error);
                return error;
            })
        )
    }


    // Perform device and firebase token check whenever user opens application, save if the token is not registered
    performCheckAndSaveDeviceOnServer(data) {

        // Check if firebase token is available / If not then assign from app service
        data.firebase_token = data.firebase_token || this._appService.registrationId;

        // Check if the firebase token is aready registered
        let token = this.user.user.devices.find((device)=> {
            return device.firebase_token && device.firebase_token == data.firebase_token;
        });

        console.log('found token', token);
        alert('found token ' + JSON.stringify(token));

        // If token doesn't exist in device registered, then register a device
        if (!token) {
            const device = { ...data.device, firebase_token: data.firebase_token, user: this.user.user.id };
            alert(JSON.stringify(device));
            if (data.firebase_token) {
                this.saveDeviceInformation(device).subscribe((response) => {
                    console.log('response : ', response);
                    alert(response.message);
                }, (error) => {
                    console.log('error: ', error);
                    alert('Error before saving information: ' + JSON.stringify(error));
                });
            } else {
                alert('Device information and firebase token missing. Can\'t save on server.');
            }
        }
    }

}
