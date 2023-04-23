import { ComponentFactoryResolver, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Overlay } from "@angular/cdk/overlay";
import { LoadingSpinnerComponent } from "src/app/shared/loading-spinner/loading-spinner.component";
import { ComponentPortal } from "@angular/cdk/portal";


@Injectable({ providedIn: 'root' })
export class LoadingSpinnerService {
  public close$ = new Subject();

  constructor(
    private overlay: Overlay,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  public show(): void {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        LoadingSpinnerComponent
      );

    const overlayRef = this.overlay.create({
      hasBackdrop: false,
    });

    const portal = new ComponentPortal(componentFactory.componentType);
    const component = overlayRef.attach<LoadingSpinnerComponent>(portal);

    component.instance.show(),
      this.close$.subscribe(() => {
        component.instance.hide();
        overlayRef.detach();
      });
  }

  public hide(): void {
    this.close$?.next('');
  }
}
