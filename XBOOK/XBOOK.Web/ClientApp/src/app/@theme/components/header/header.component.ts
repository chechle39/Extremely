import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../coreapp/services/login.service';
import { AuthenticationService } from '../../../coreapp/services/authentication.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  slogan: string;
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];
  lang = [
    {
      value: 'vi',
      name: 'Vietnamese',
    },
    {
      value: 'en',
      name: 'English',
    },

  ];
  curr = 'vi';
  currentTheme = 'default';
  tag = 'my-context-menu';
  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    private translate: TranslateService,
    private loginService: LoginService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private breakpointService: NbMediaBreakpointsService,
    private http: HttpClient,
    ) {
      menuService.onItemClick()
      .pipe(filter(({ tag }) => tag === this.tag))
      .subscribe((rp) => {
        if (rp.item.title === 'Log out') {
          this.logout();
        }
      });
      this.http.get('assets/slogan.txt', { responseType: 'text' }).subscribe((data: any) => {
        this.slogan = data;
      })
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.user = {
      name: JSON.parse(sessionStorage.getItem('credentials')).fullName,
    };
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }
  logout() {
    this.loginService.logOut().subscribe(() => {
      this.authenticationService.logout().subscribe(() =>
      this.router.navigate(['/auth/login'], { replaceUrl: true }));
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  ChangeLanguage(language: string) {
    this.translate.use(language);
  }


}
