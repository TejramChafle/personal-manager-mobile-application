import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthProvider } from '../pages/auth/auth.provider';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private _authService: AuthProvider) {}

    intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
        if (!req.url.includes('auth')) {
            let request = req.clone({
                // params: new HttpParams().set('auth', this._authService.user.token)
                /* headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this._authService.user.token
                }) */
                setHeaders: {
                    'Authorization': 'Bearer ' + this._authService.user.token
                }
            })
            return next.handle(request);
        }
        return next.handle(req);
    }
}