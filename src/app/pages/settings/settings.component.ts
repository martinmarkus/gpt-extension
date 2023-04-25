import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs';
import { ApiKeyRequestDTO, GPTClient, ResponseType } from 'src/app/core/api/gpt-server.generated';
import { ApiKey } from 'src/app/core/chrome/api-key.interface';
import { GeneralModalService } from 'src/app/core/modal/general-modal.service';
import { subscriptionHolder } from 'src/app/core/utils/subscription-holder';
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
    private readonly modalService: GeneralModalService<ConfirmPopupComponent>,
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

  onEdit(apiKey: string): void {

  }

  onDeleteConfirm(apiKeyName: string, key: string): void {
    this.modalService.open(ConfirmPopupComponent, {
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
        this.modalService.close();
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
