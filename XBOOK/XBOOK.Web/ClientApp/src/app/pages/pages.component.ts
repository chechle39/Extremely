import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuService } from './_shared/services/menu.service';
import { NbMenuService } from '@nebular/theme';
import { DataService } from './_shared/services/data.service';
import { map, concatAll, mergeMap, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu" id="menuRef"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {
  rawMenu: any;
  menu = [];
  constructor(
    public translate: TranslateService,
    private menuService: MenuService,
    private menusv: NbMenuService,
    private data: DataService,
  ) {
    menusv.onItemClick().subscribe((rp) => {
      if (rp.item.link !== '/pages/invoice') {
        this.data.sendApplySearchIv('');
      }
      if (rp.item.link !== '/pages/buyinvoice') {
        this.data.sendApplySearchBuyIv('');
      }
      if (rp.item.link !== '/pages/journalentries') {
        this.data.sendApplySearchJunal('');
      }
      if (rp.item.link !== '/pages/Cashbalance') {
        this.data.sendMessageMoneyFund('');
      }
      if (rp.item.link !== 'pages/generalledger') {
        this.data.sendMessageGenneral('');
      }
    });
  }
  ngOnInit(): void {
    this.menuService.getAllMenu()
      .subscribe((rp: any) => {
        this.rawMenu = rp;
        this.loadMenu();
      });
  }

  loadMenu() {
      const flatenMenu = this.flatten([this.rawMenu, this.rawMenu.map(item => item.children)])
                              .map(item => item.title);
      this.translate.stream(flatenMenu)
        .subscribe(titles => {
          this.menu = [];
          for (let i = 0; i < this.rawMenu.length; i++) {
            if (this.rawMenu[i].children.length === 0) {
              const data = {
                title: titles[this.rawMenu[i].title],
                icon: this.iconFactory(this.rawMenu[i].icon),
                link: this.rawMenu[i].link,
              };
              this.menu.push(data);
            } else {
              const data = {
                title: titles[this.rawMenu[i].title],
                icon: this.iconFactory(this.rawMenu[i].icon),
                link: this.rawMenu[i].link,
                children: this.rawMenu[i].children.map(child => {
                  const subMenu = {...child};
                  subMenu.title = titles[child.title];
                  return subMenu;
                }),
              };
              this.menu.push(data);
            }
          }
          this.setMenuItemActiveWhenExpanded();
    });
  }

  iconFactory(icon: string) {
    if (icon == null) {
      return null;
    }
    if (icon.match(/^fa.*$/)) {
      return { icon: icon, pack: 'font-awesome' };
    }
    if (icon.match(/^custom.*$/)) {
      return { icon: icon, pack: 'custom' };
    }
    return icon;
  }

  setMenuItemActiveWhenExpanded() {
    const items = document.getElementById('menuRef')
      .querySelector('.menu-items')
      .getElementsByClassName('menu-items');
    if (items) {
      setTimeout(() => {
        Array.from(items).map((element: any) => {
          element.previousElementSibling.onclick = () => {
            if (element.classList.contains('collapsed')) {
              element.previousElementSibling.classList.remove('active');
            } else if (element.classList.contains('expanded')) {
              element.previousElementSibling.classList.add('active');
            }
          };
          return element;
        });
      }, 0);
    }
  }

  flatten(ary, ret = []) {
    for (const entry of ary) {
        if (Array.isArray(entry)) {
            this.flatten(entry, ret);
        } else {
            ret.push(entry);
        }
    }
    return ret;
}
}
