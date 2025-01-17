import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take, takeUntil } from 'rxjs';
import { ApiKeyRequestDTO, GPTClient, ResponseType } from 'src/app/core/api/gpt-server.generated';
import { ApiKey } from 'src/app/core/chrome/api-key.interface';
import { ChromeStorageService } from 'src/app/core/chrome/chrome-storage-service';
import { GeneralModalService } from 'src/app/core/modal/general-modal.service';
import { subscriptionHolder } from 'src/app/core/utils/subscription-holder';
import { ApiKeyPopupComponent } from 'src/app/shared/api-key-popup/api-key-popup.component';
import { ApiKeyPopupModel } from 'src/app/shared/api-key-popup/api-key-popup.model';
import { ConfirmPopupModel } from 'src/app/shared/confirm-popup/confirm-popup-model';
import { ConfirmPopupComponent } from 'src/app/shared/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent extends subscriptionHolder() implements OnInit, OnDestroy {
  apiKeys: ApiKey[] = [];
  showChat: boolean = false;

  deleteConfirmModel = {
    question: `Biztosan törölni szeretné az API kulcsot?`,
    confirmText: 'Törlés',
    cancelText: 'Mégsem'
  } as ConfirmPopupModel;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly client: GPTClient,
    private readonly storageService: ChromeStorageService,
    private readonly confirmModalService: GeneralModalService<ConfirmPopupComponent>,
    private readonly apiKeyModalService: GeneralModalService<ApiKeyPopupComponent>) {
    super();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  ngOnInit(): void {
    this.loadKeys();
  }

  loadKeys(): void {
    this.client.getOwnApiKeys()
      .pipe(take(1), takeUntil(this.destroyed$))
      .subscribe(response => {
        this.apiKeys = response.keys.map(x => {
          return {
            id: x?.id ?? '',
            key: x?.key ?? '',
            keyName: x?.keyName ?? '',
            isActive: x?.isActive ?? false
          } as ApiKey;
        });

        const state = this.storageService.getAppState();

        state.apiKeys = this.apiKeys;

        this.storageService.setAppState(state);

        this.cdr.detectChanges();
      });
  }

  close(): void {
    window.close();
  }

  onEdit(apiKey?: string, name?: string, id?: string): void {
    console.log('test: ' + id);
    this.openApiKeyPopup(apiKey, name, id);
  }

  private openApiKeyPopup(key?: string, name?: string, id?: string): void {
    this.apiKeyModalService.open(ApiKeyPopupComponent, {
        apiKey: key ?? '',
        name: name ?? '',
        isAdding: !!key,
        id: id ?? ''
      } as ApiKeyPopupModel)
      .afterClosed()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((keys) => {
        this.apiKeyModalService.close();
        this.loadKeys();
        this.cdr.detectChanges();
      });
  }

  onDeleteConfirm(apiKeyName: string, key: string, id: string): void {
    this.confirmModalService.open(ConfirmPopupComponent, this.deleteConfirmModel)
      .afterClosed()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((confirmed) => {
        this.confirmModalService.close();
        if (confirmed) {
          this.deleteKey(apiKeyName, key, id);
        }
        this.loadKeys();
        this.cdr.detectChanges();
      });
  }

  deleteKey(name: string, key: string, id: string): void {
    this.client.removeApiKey(new ApiKeyRequestDTO({
        apiKey: key ?? '',
        apiKeyName: name ?? '',
        id: id
      }))
      .pipe(take(1), takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response.responseType === ResponseType.Success) {
          // sikeres törlés
        } else {
          // sikertelen törlés
        }

        this.loadKeys();
        this.cdr.detectChanges();
      });
  }

  logout(): void {
    this.storageService.setAppState(undefined);
    this.router.navigate(['']);
    this.hideChat();
  }

  setActive(apiKey: ApiKey): void {
    this.client.setActiveApiKey(new ApiKeyRequestDTO({
        apiKey: apiKey?.key ?? '',
        apiKeyName: apiKey?.keyName ?? '',
        id: apiKey?.id ?? ''
      }))
      .pipe(takeUntil(this.destroyed$), take(1))
      .subscribe(() => {
        this.loadKeys();
        this.cdr.detectChanges();
      });
  }

  toggleChat(): void {
    const state = this.storageService.getAppState();
    state.showChat = !state.showChat ?? false;
    this.showChat = state.showChat;
    this.storageService.setAppState(state);
    this.cdr.detectChanges();

    if (this.showChat) {
      this.close();
    }
  }

  hideChat(): void {
    const state = this.storageService.getAppState();
    state.showChat = false;
    this.storageService.setAppState(state);
    this.cdr.detectChanges();
  }
}
