import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs/operators';

export abstract class BaseModalService {
  constructor(
    protected readonly dialog: MatDialog,
    protected readonly scrollStrategyOptions: ScrollStrategyOptions
  ) {}

  public open(
    componentType: any,
    data: any,
    maxWidthStyle: string = '',
    minWidthStyle: string = ''
  ): MatDialogRef<any, any> {
    const dialogRef = this.dialog.open(componentType, {
      maxHeight: '90vh',
      width: '100%',
      maxWidth: '600px',
      minWidth: '250px',
      position: {},
      data: data,
      scrollStrategy: this.scrollStrategyOptions.reposition(),
    } as MatDialogConfig);

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(() => {
        this.setBodyScroll(true);
      });

    this.setBodyScroll(false);

    return dialogRef;
  }

  public close(): void {
    this.dialog.closeAll();
  }

  private setBodyScroll(value: boolean): void {
    const body = document.getElementsByTagName('body')[0];

    if (value) {
      body.classList.remove('scroll__disable');
    } else {
      body.classList.add('scroll__disable');
    }
  }
}
