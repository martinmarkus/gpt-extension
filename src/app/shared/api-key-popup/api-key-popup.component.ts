import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ApiKeyPopupModel } from './api-key-popup.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiKeyRequestDTO, GPTClient } from 'src/app/core/api/gpt-server.generated';
import { take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-api-key-popup',
  templateUrl: './api-key-popup.component.html',
  styleUrls: ['./api-key-popup.component.scss'],
})
export class ApiKeyPopupComponent implements OnInit {
  key: string = '';
  name: string = '';

  constructor(
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
    if (!this.name || !this.key) {
      return;
    }

    this.client.addApiKey(new ApiKeyRequestDTO({
      apiKey: this.name ?? '',
      apiKeyName: this.key ?? ''
    }))
    .pipe(take(1))
    .subscribe(() => {
      this.dialogRef.close();
    });
  }
}
