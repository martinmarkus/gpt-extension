import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs';
import { ApiKeyRequestDTO, GPTClient, ResponseType } from 'src/app/core/api/gpt-server.generated';
import { ApiKey } from 'src/app/core/chrome/api-key.interface';
import { GeneralModalService } from 'src/app/core/modal/general-modal.service';
import { subscriptionHolder } from 'src/app/core/utils/subscription-holder';
import { ApiKeyPopupComponent } from 'src/app/shared/api-key-popup/api-key-popup.component';
import { ApiKeyPopupModel } from 'src/app/shared/api-key-popup/api-key-popup.model';
import { ConfirmPopupModel } from 'src/app/shared/confirm-popup/confirm-popup-model';
import { ConfirmPopupComponent } from 'src/app/shared/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends subscriptionHolder() implements OnInit, OnDestroy {
  apiKeys: ApiKey[] = [];

  constructor(
    private readonly confirmModalService: GeneralModalService<ConfirmPopupComponent>,
    private readonly apiKeyModalService: GeneralModalService<ApiKeyPopupComponent>,
    private readonly client: GPTClient) {
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
          key: x?.key ?? '',
          keyName: x?.keyName ?? '',
          isActive: x?.isActive ?? false
        } as ApiKey;
      })
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
  }

  onDeleteConfirm(apiKeyName: string, key: string): void {
    this.confirmModalService.open(ConfirmPopupComponent, {
      question: `Biztosan törölni szeretné a(z) '${apiKeyName}' API kulcsot?`,
      confirmText: 'Törlés',
      cancelText: 'Mégsem'
    } as ConfirmPopupModel)
      .afterClosed()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((confirmed) => {

        if (confirmed) {
          this.deleteKey(apiKeyName, key);
        }
        this.confirmModalService.close();
        this.loadKeys();
      });
  }

  deleteKey(name: string, key: string): void {
    this.client.removeApiKey(new ApiKeyRequestDTO({
        apiKey: key ?? '',
        apiKeyName: name ?? ''
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

}
