import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, take, takeUntil } from 'rxjs';
import { AuthenticationClient, LoginRequestDTO } from 'src/app/core/api/gpt-server.generated';
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
    private readonly ngZone: NgZone,
    private readonly authClient: AuthenticationClient,
    private readonly spinner: LoadingSpinnerService) {
    super();
  }

  ngOnInit(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
      debugger;
      const currentTab = tabs[0];
      console.log(currentTab);

      chrome.tabs.executeScript(currentTab.id, {
        code: `console.log(document.title);`
      });
    });
  }

  login(): void {
    this.spinner.show();
    this.authClient.login(new LoginRequestDTO({
        email: 'test@gmail.com',
        password: 'Alma12345'
      }))
      .pipe(takeUntil(this.destroyed$), take(1), finalize(() => {
        this.spinner.hide();
      }))
      .subscribe(response => {

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
