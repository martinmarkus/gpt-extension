import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, take, takeUntil } from 'rxjs';
import { AuthenticationClient, LoginRequestDTO } from 'src/app/core/api/gpt-server.generated';
import { setAuthToken } from 'src/app/core/auth-token-container';
import { ApiKey } from 'src/app/core/chrome/api-key.interface';
import { AppState } from 'src/app/core/chrome/app-state.interface';
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

  constructor(
    private readonly router: Router,
    private readonly ngZone: NgZone,
    private readonly authClient: AuthenticationClient,
    private readonly spinner: LoadingSpinnerService) {
    super();
  }

  ngOnInit(): void {
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
    //   debugger;
    //   const currentTab = tabs[0];
    //   console.log(currentTab);

    //   chrome.tabs.executeScript(currentTab.id, {
    //     code: `console.log(document.title);`
    //   });
    // });

    console.log('init');

    this.initChromeState();

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

  async initChromeState(): Promise<void> {
    const response = await this.authClient.getUser()
        .pipe(take(1))
        .toPromise();

    chrome.storage.sync.get("appState", (item: AppState) => {

      setAuthToken(item?.authToken ?? '');

      chrome.storage.sync.set({ "appState": {
        email: response?.email,
        authToken: item?.authToken,
        apiKeys: response?.apiKeysResponseDTO.keys.map(x => {
            return {
              key: x.key ?? '',
              keyName: x?.keyName ?? '',
              isActive: x?.isActive?? false
            } as ApiKey;
          }
        ),
       } as AppState }, () => {
        this.router.navigate(['/settings']);
       });
    });
  }

  login(): void {
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

    this.spinner.show();
    this.authClient.login(new LoginRequestDTO({
        email: this.formGroup.controls.email.value?.toString() ?? '',
        password: this.formGroup.controls.password.value?.toString() ?? ''
      }))
      .pipe(takeUntil(this.destroyed$), take(1), finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(response => {

        chrome.storage.sync.set({ "appState": {
            email: this.formGroup.controls.email.value?.toString() ?? '',
            authToken: response?.authToken,
            apiKeys: []
          }},
          function(){});

          setAuthToken(response?.authToken ?? '');

        this.router.navigate(['settings']);
      });


      const doc = document.getElementById('center');
      (doc as HTMLElement).style.display = 'none';
  }

  close(): void {
    window.close();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
