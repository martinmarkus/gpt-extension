import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  public getBrowserLanguage(): string {
     const browserLanguage = navigator.language.toLocaleUpperCase();

     return browserLanguage ?? 'en';
  }
}
