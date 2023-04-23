import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export type Constructor<T = {}> = new (...args: any[]) => T;

export const subscriptionHolder = <T extends Constructor>(
  base: T = class {} as T
) =>
  class extends base implements OnDestroy {
    protected readonly destroyed$ = new Subject<void>();
    ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
    }
  };
