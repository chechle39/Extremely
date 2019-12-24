import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyreceiptComponent } from './moneyreceipt.component';

describe('MoneyreceiptComponent', () => {
  let component: MoneyreceiptComponent;
  let fixture: ComponentFixture<MoneyreceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoneyreceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyreceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
