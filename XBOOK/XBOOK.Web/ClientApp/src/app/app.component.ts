import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
//import defaultLanguage from '../assets/i18n/en.json';
@Component({
  selector: 'xb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Xbook';
  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'vi']);
    translate.setDefaultLang('en');

    //const browserLang = translate.getBrowserLang();
    // translate.use(browserLang.match(/en|vi/) ? browserLang : 'en');
  }
}
