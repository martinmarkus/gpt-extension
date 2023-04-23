import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LanguageService } from '../language/language-service';

@Injectable()
export class ExtensionHttpInterceptor implements HttpInterceptor {
  constructor(
    private readonly languageService: LanguageService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      // setHeaders: {
      //   LANGUAGE: this.languageService.getBrowserLanguage().toLocaleLowerCase(),
      //   // Api key for every calls
      //   'X-API-KEY': 'test'
      // },
    });
    return next.handle(request);
  }
}
