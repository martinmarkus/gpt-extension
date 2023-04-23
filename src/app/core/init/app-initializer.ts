import { Router } from '@angular/router';
import { AuthenticationClient } from '../api/gpt-server.generated';
import { take } from 'rxjs';
import { AppState } from '../chrome/app-state.interface';
import { ApiKey } from "../chrome/api-key.interface";
import { setAuthToken } from '../auth-token-container';

declare const chrome: any;

export function initApp(
  authClient: AuthenticationClient,
  router: Router,
) {

  return async () => {
    try {
      const response = await authClient.getUser()
        .pipe(take(1))
        .toPromise();

        chrome.storage.sync.get("appState", (item: AppState) => {
          console.log('app init AppState:' + JSON.stringify(item));

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
            console.log('app init AppState set finish');
            router.navigate(['/settings']);
           });
        });

    } catch (error: any) {

    }
  };
}
