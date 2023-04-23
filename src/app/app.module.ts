import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ExtensionHttpInterceptor } from './core/interceptors/http-interceptor';
import { API_BASE_URL, AuthenticationClient } from './core/api/gpt-server.generated';
import { environment } from 'src/environments/environment';
import { initApp } from './core/init/app-initializer';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AngularSvgIconModule.forRoot()
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExtensionHttpInterceptor,
      multi: true,
    },
    {
      provide: API_BASE_URL,
      useFactory: () => environment.apiBaseUrl,
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initApp,
      deps: [
        AuthenticationClient,
        Router,
      ],
    },
  ],
})
export class AppModule { }
