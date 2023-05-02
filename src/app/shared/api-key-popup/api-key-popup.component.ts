import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ApiKeyPopupModel } from './api-key-popup.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiKeyRequestDTO, GPTClient } from 'src/app/core/api/gpt-server.generated';
import { take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-api-key-popup',
  templateUrl: './api-key-popup.component.html',
  styleUrls: ['./api-key-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiKeyPopupComponent implements OnInit {
  key: string = '';
  name: string = '';

  showKeyError: boolean = false;
  showNameError: boolean = false;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly client: GPTClient,
    public dialogRef: MatDialogRef<ApiKeyPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly model: ApiKeyPopupModel
  ) {

  }

  ngOnInit(): void {

  }

  close(): void {
    this.dialogRef.close();
  }

  cancel(): void {
    this.close();
  }

  save(): void {
    this.showKeyError = false;
    this.showNameError = false;

    let hasError: boolean = false;

    if (!this.name) {
      this.showNameError = true;
      hasError = true;
    }

    if (!this.key) {
      this.showKeyError = true;
      hasError = true;
    }

    if (hasError) {
      this.cdr.detectChanges();
      return;
    }

    this.client.addOrUpdateActiveApiKey(new ApiKeyRequestDTO({
        apiKey: this.name ?? '',
        apiKeyName: this.key ?? '',
        id: this.model.id
      }))
      .pipe(take(1))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}
