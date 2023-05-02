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

  onEdit(apiKey?: string, name?: string): void {
    this.openApiKeyPopup(apiKey, name);
  }

  private openApiKeyPopup(key?: string, name?: string): void {
    this.apiKeyModalService.open(ApiKeyPopupComponent, {
        apiKey: key ?? '',
        name: name ?? '',
        isAdding: !!key
      } as ApiKeyPopupModel)
      .afterClosed()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((keys) => {
        this.loadKeys();
      });
  }

  onDeleteConfirm(apiKeyName: string, key: string, id: string): void {
    this.confirmModalService.open(ConfirmPopupComponent, {
      question: `Biztosan törölni szeretné a(z) '${apiKeyName}' API kulcsot?`,
      confirmText: 'Törlés',
      cancelText: 'Mégsem'
    } as ConfirmPopupModel)
      .afterClosed()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.deleteKey(apiKeyName, key, id);
        }
        this.loadKeys();
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
      });
  }

  logout(): void {
    this.storageService.setAppState(undefined);
    this.router.navigate(['']);
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
      });
  }
}
