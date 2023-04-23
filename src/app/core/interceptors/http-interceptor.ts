import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LanguageService } from '../language/language-service';
import { Router } from '@angular/router';
import { getAuthToken } from '../auth-token-container';

declare const chrome: any;

@Injectable()
export class ExtensionHttpInterceptor implements HttpInterceptor {
  constructor(
    private readonly router: Router,
    private readonly languageService: LanguageService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        'Authorization': getAuthToken(),
        LANGUAGE: this.languageService.getBrowserLanguage().toLocaleLowerCase(),
        // Api key for every calls
        'X-API-KEY': 'test'
      },
    });

    return next.handle(request)
      .pipe(map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.status === 401) {
            //this.router.navigate(['']);
            return event;
          }
        }

        return event;
    }));
  }
}
