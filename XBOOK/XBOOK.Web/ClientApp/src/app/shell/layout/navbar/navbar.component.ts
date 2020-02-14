import { Component, OnInit, EventEmitter, Output, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '@shared/service/layout.service';
import { ConfigService } from '@shared/service/config.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { Router } from '@angular/router';
import { LoginService } from '@core/services/login.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {

  currentLang = 'en';
  toggleClass = 'ft-maximize';
  placement = 'bottom-right';
  public isCollapsed = true;
  layoutSub: Subscription;
  @Output()
  toggleHideSidebar = new EventEmitter<any>();

  public config: any = {};

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private loginService: LoginService,
    private translate: TranslateService,
    private layoutService: LayoutService,
    private configService: ConfigService) {
    // const browserLang: string = translate.getBrowserLang();
    // translate.use(browserLang.match(/en|vi/) ? browserLang : 'en');

    this.layoutSub = layoutService.changeEmitted$.subscribe(
      direction => {
        const dir = direction.direction;
        if (dir === 'rtl') {
          this.placement = 'bottom-left';
        } else if (dir === 'ltr') {
          this.placement = 'bottom-right';
        }
      });
  }

  ngOnInit() {
    this.config = this.configService.templateConf;
  }

  ngAfterViewInit() {
    if (this.config.layout.dir) {
      setTimeout(() => {
        const dir = this.config.layout.dir;
        if (dir === 'rtl') {
          this.placement = 'bottom-left';
        } else if (dir === 'ltr') {
          this.placement = 'bottom-right';
        }
      }, 0);

    }
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
  }

  ChangeLanguage(language: string) {
    this.translate.use(language);
  }

  ToggleClass() {
    if (this.toggleClass === 'ft-maximize') {
      this.toggleClass = 'ft-minimize';
    } else {
      this.toggleClass = 'ft-maximize';
    }
  }

  toggleNotificationSidebar() {
    this.layoutService.emitNotiSidebarChange(true);
  }

  toggleSidebar() {
    const appSidebar = document.getElementsByClassName('app-sidebar')[0];
    if (appSidebar.classList.contains('hide-sidebar')) {
      this.toggleHideSidebar.emit(false);
    } else {
      this.toggleHideSidebar.emit(true);
    }
  }
  logout() {
    this.loginService.logOut().subscribe(() => {
      this.router.navigate(['/login'], { replaceUrl: true });
    });
    // this.authenticationService.logout()
    //   .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }
}
