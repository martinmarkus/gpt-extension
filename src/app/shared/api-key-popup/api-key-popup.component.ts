import { Component, Inject, OnInit } from '@angular/core';
import { ApiKeyPopupModel } from './api-key-popup.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-api-key-popup',
  templateUrl: './api-key-popup.component.html',
  styleUrls: ['./api-key-popup.component.scss']
})
export class ApiKeyPopupComponent implements OnInit {

  formGroup = new FormGroup({
    key: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
  });


  constructor(
    public dialogRef: MatDialogRef<ApiKeyPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly model: ApiKeyPopupModel
  ) {

  }

  ngOnInit(): void {
    this.formGroup.controls.name.patchValue('');
    this.formGroup.controls.key.patchValue('');

  }

  close(): void {
    this.dialogRef.close();
  }

  cancel(): void {
    this.close();
  }

  save(): void {

  }
}
