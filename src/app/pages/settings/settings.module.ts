import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    SettingsRoutingModule,
    CommonModule,
  ],
  providers: [],
})
export class SettingsModule { }
