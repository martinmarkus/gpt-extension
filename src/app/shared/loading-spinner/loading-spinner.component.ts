import { Component, OnDestroy, OnInit } from '@angular/core';
import { subscriptionHolder } from 'src/app/core/utils/subscription-holder';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent
  extends subscriptionHolder()
  implements OnInit, OnDestroy {

  constructor() {
    super();
  }

  ngOnInit(): void { }

  show(): void {
    // INFO: Hide footer on displaying loading spinner
    //this.menuStructureService.footer$.next(false);
  }

  hide(): void {
    // INFO: Display footer on hiding loading spinner
    //this.menuStructureService.footer$.next(true);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
