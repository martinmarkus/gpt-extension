import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppState } from "./app-state.interface";

declare const chrome: any;

@Injectable({ providedIn: 'root' })
export class ChromeStorageService {

  private static appState?: AppState;

  getAppState(): AppState {
    return ChromeStorageService.appState!;
  }

  setAppState(appState?: AppState): void {
    ChromeStorageService.appState = appState;

    if (!appState) {
      chrome.storage.sync.remove("appState", () => {});
      return;
    }

    chrome.storage.sync.set({ "appState": appState}, () => {
    });
  }

}
