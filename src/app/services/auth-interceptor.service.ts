import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = sessionStorage.getItem('token');
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken),
    });

    return next.handle(authReq);
  }
  constructor() {}
}
