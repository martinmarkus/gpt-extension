import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, catchError, finalize, take, takeUntil } from 'rxjs';
import { AuthenticationClient, LoginRequestDTO } from 'src/app/core/api/gpt-server.generated';
import { AppState } from 'src/app/core/chrome/app-state.interface';
import { ChromeStorageService } from 'src/app/core/chrome/chrome-storage-service';
import { ExternalUrlConstants } from 'src/app/core/constants/external-url-constants';
import { LoadingSpinnerService } from 'src/app/core/loading-spinner/loading-spinner.service';
import { subscriptionHolder } from 'src/app/core/utils/subscription-holder';

declare const chrome: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends subscriptionHolder() implements OnInit, OnDestroy {
  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  registerUrl = ExternalUrlConstants.AiChatMaster;
  invalidLoginMessage: string = '';

  constructor(
    private readonly appStateService: ChromeStorageService,
    private readonly router: Router,
    private readonly ngZone: NgZone,
    private readonly authClient: AuthenticationClient,
    private readonly spinner: LoadingSpinnerService) {
    super();
  }

  ngOnInit(): void {
    this.formGroup.controls.email.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(val => {
        if (!val) {
          this.formGroup.controls.email.setErrors({'invalid': true});
        }
      });

    this.formGroup.controls.password.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(val => {
        if (!val) {
          this.formGroup.controls.password.setErrors({'invalid': true});
        }
      });
  }

  login(): void {
    this.formGroup.controls.email.setValue('teszt@aichatmester.hu');
    this.formGroup.controls.password.setValue('Alma12345');

    let hasError = false;
    if (!this.formGroup.controls.email.valid) {
      this.formGroup.controls.email.setErrors({'invalid': true});
      hasError = true;
    }

    if (!this.formGroup.controls.password.valid) {
      this.formGroup.controls.password.setErrors({'invalid': true});
      hasError = true;
    }

    if (hasError) {
      return;
    }

    this.formGroup.controls.email.setErrors(null);
    this.formGroup.controls.password.setErrors(null);
    this.invalidLoginMessage = '';
    this.spinner.show();
    this.authClient.login(new LoginRequestDTO({
        email: this.formGroup.controls.email.value?.toString() ?? '',
        password: this.formGroup.controls.password.value?.toString() ?? ''
      }))
      .pipe(takeUntil(this.destroyed$), take(1), finalize(() => {
        this.spinner.hide();
      }),
      catchError((error) => {
        this.invalidLoginMessage = 'Nem található felhasználó a megadott belépési adatokkal.';
        return EMPTY;
      }))
      .subscribe(response => {
        if (!response || !response.authToken) {
          this.invalidLoginMessage = 'Nem található felhasználó a megadott belépési adatokkal.';
          return;
        }
        // INFO: Set app state
        let appState = this.appStateService.getAppState();

        if (!appState) {
          appState = {
            authToken: response?.authToken ?? '',
            apiKeys: [],
            email: this.formGroup.controls.email.value?.toString() ?? ''
          } as AppState;
        }

        this.appStateService.setAppState(appState)

        // INFO: navigate to settings
        this.router.navigate(['settings']);
      });
  }

  close(): void {
    window.close();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
