import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMoneyReceiptComponent } from './create-money-receipt.component';

describe('CreateMoneyReceiptComponent', () => {
  let component: CreateMoneyReceiptComponent;
  let fixture: ComponentFixture<CreateMoneyReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMoneyReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMoneyReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
