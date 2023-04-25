import { ComponentType, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { BaseModalService } from './base-modal.service';

@Injectable({providedIn: 'root'})
export class GeneralModalService<T> extends BaseModalService {
  constructor(dialog: MatDialog, scrollStrategyOptions: ScrollStrategyOptions) {
    super(dialog, scrollStrategyOptions);
  }

  openModal(type: ComponentType<any>, data: T): Observable<any> {
    const dialogRef = super.open(type, data, '950px', '250px');

    return dialogRef.afterClosed();
  }
}
