import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(req.url);
    if (req.url.includes('logout')) {
      localStorage.removeItem('authorization');
      return of(new HttpResponse({status: 200}));
    }
    let updatedRequest: HttpRequest<any>;
    const jwtToken = localStorage.getItem('authorization');
    if (jwtToken) {
      updatedRequest = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + jwtToken)
      });
    } else {
      updatedRequest = req.clone();
    }
    return next.handle(updatedRequest).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const token = event.headers.get('Authorization');
          if (token) {
            localStorage.setItem('authorization', token);
          }
        }
      })
    );
  }

}
