import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ApiKeyPopupComponent } from './api-key-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  //declarations: [ApiKeyPopupComponent],
  //exports: [ApiKeyPopupComponent],
  imports: [CommonModule, AngularSvgIconModule, ReactiveFormsModule, FormsModule],
})
export class ApiKeyPopupModule {}
