import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuService } from './_shared/services/menu.service';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {
  menu= [];
  constructor(
     public translate: TranslateService,
     private menuService: MenuService,
     ) {
  }
  ngOnInit(): void {
    this.menuService.getAllMenu().subscribe((rp: any) => {
      // this.menu = rp;

      for (let i = 0; i < rp.length; i++) {
        if (rp[i].children.length === 0 ) {
          const data = {
            title: rp[i].title,
            icon: rp[i].icon,
            link: rp[i].link,
          };
          this.menu.push(data);
        } else {
          const data = {
            title: rp[i].title,
            icon: rp[i].icon,
            link: rp[i].link,
            children: rp[i].children,
          };
          this.menu.push(data);
        }
      }
    });
  }

}
