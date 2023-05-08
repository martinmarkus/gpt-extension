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
import { ApiKeyPopupModule } from 'src/app/shared/api-key-popup/api-key-popup.module';
import { ApiKeyPopupComponent } from 'src/app/shared/api-key-popup/api-key-popup.component';
import { ConfirmPopupComponent } from 'src/app/shared/confirm-popup/confirm-popup.component';

@NgModule({
  declarations: [
    SettingsComponent,
    ApiKeyPopupComponent,
    ConfirmPopupComponent
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
    ApiKeyPopupModule
  ],
  providers: [],
})
export class SettingsModule { }
