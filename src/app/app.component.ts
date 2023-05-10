import { Component, OnInit } from '@angular/core';
import { AppState } from './core/chrome/app-state.interface';
import { AuthenticationClient } from './core/api/gpt-server.generated';
import { ChromeStorageService } from './core/chrome/chrome-storage-service';
import { LoadingSpinnerService } from './core/loading-spinner/loading-spinner.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

declare const chrome: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private readonly spinner: LoadingSpinnerService,
    private readonly appStateService: ChromeStorageService,
    private readonly router: Router,
    private readonly authClient: AuthenticationClient) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();

    try {
      chrome.storage.sync.get("appState", async (item: any) => {
        const appState = item?.appState as AppState;
        this.appStateService.setAppState(appState);

        try {
          const response = await this.authClient.getUser()
            .pipe(take(1))
            .toPromise();

            appState.email = response?.email ?? '';
            appState.apiKeys = response?.apiKeysResponseDTO?.keys ?? [];
            appState.showChat = false;
            this.appStateService.setAppState(appState)

          this.router.navigate(['settings']);
        } catch (error: any) { }
        finally {
          this.spinner.hide();
        }
      });
    } catch (error: any) { }
    finally {
      this.spinner.hide();
    };
  }
}
