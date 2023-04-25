import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { GeneralModalService } from './general-modal.service';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    AngularSvgIconModule.forRoot()
  ],
})
export class ModalModule {}
