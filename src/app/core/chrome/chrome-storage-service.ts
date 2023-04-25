import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppState } from "./app-state.interface";

declare const chrome: any;

@Injectable({ providedIn: 'root' })
export class ChromeStorageService {

  private static appState: AppState;

  getAppState(): AppState {
    console.log('appState get: ' + JSON.stringify(ChromeStorageService.appState))
    return ChromeStorageService.appState;
  }

  setAppState(appState: AppState): void {
    ChromeStorageService.appState = appState;

    chrome.storage.sync.set({ "appState": appState}, () => {
      console.log('appState set: ' + JSON.stringify(appState))
    });
  }

}
