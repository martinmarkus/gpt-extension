import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfirmPopupComponent } from './confirm-popup.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [ConfirmPopupComponent],
  exports: [ConfirmPopupComponent],
  imports: [CommonModule, AngularSvgIconModule],
})
export class ConfirmPopupModule {}
