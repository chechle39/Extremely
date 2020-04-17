/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, OnInit} from '@angular/core';
import {AnalyticsService} from './@core/utils/analytics.service';
import {SeoService} from './@core/utils/seo.service';
import {TranslateService} from '@ngx-translate/core';
import {PaceService} from './coreapp/services/pace.service';
import {NbIconLibraries} from '@nebular/theme';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(
    private analytics: AnalyticsService,
    private seoService: SeoService,
    public translate: TranslateService,
    private pace: PaceService,
    private iconLibraries: NbIconLibraries,
  ) {
    translate.addLangs(['vi', 'en']);
    translate.setDefaultLang('vi');

    this.iconLibraries.registerFontPack('font-awesome', {packClass: 'fas'});
    this.iconLibraries.registerSvgPack('custom', {
      'custom-dollar': '<svg xmlns="http://www.w3.org/2000/svg" ' +
                        'fill="none" height="100%" stroke="currentColor" ' +
                        'stroke-linecap="round" stroke-linejoin="round" stroke-width="2" ' +
                        'viewBox="0 0 24 24" width="100%"><line x1="12" x2="12" y1="2" y2="22"></line>' +
                        '<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
    });
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();

    this.pace.trackingLazyLoadModule();
  }
}
