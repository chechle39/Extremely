import { NotifyService } from './services/notify.service';
import { Injector, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from './services/message.service';

export abstract class AppComponentBase implements OnDestroy {
  private subscriptions: Subscription[] = [];
  notify: NotifyService;
  message: MessageService;
  constructor(injector: Injector) {
    this.notify = injector.get(NotifyService);
    this.message = injector.get(MessageService);
    const func = this.ngOnDestroy;
    this.ngOnDestroy = () => {
      func();
      this.unsubscribeAll();
    };
  }
  protected safeSubscription(sub: Subscription): Subscription {
    this.subscriptions.push(sub);
    return sub;
  }

  protected safeSubscriptions(subs: Subscription[]): Subscription[] {
    this.subscriptions.push(...subs);
    return subs;
  }

  public unsubscribeAll() {
    this.subscriptions.forEach(element => !element.closed && element.unsubscribe());
  }
  ngOnDestroy() {
  }
}
