import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { thousandSuffix } from '../../shared/utils/util';

export class ChartBase implements OnDestroy {
  protected _onDestroy = new Subject();

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  
  public suffix(value) {
    return thousandSuffix(value);
  }
}
