import { Injectable } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PaceService {

constructor(
  private router: Router,
  ) {}

  public trackingLazyLoadModule() {
    this.router.events.subscribe((val) => {
      if (val instanceof RouteConfigLoadStart) {
        window['Pace'].restart();
      } else if (val instanceof RouteConfigLoadEnd) {
        window['Pace'].stop();
      }
    });
  }
}
