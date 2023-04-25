import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModalModule } from 'src/app/core/modal/modal.module';
import { ConfirmPopupModule } from 'src/app/shared/confirm-popup/confirm-popup.module';

@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    SettingsRoutingModule,
    CommonModule,
    AngularSvgIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ModalModule,
    ConfirmPopupModule,
  ],
  providers: [],
})
export class SettingsModule { }
