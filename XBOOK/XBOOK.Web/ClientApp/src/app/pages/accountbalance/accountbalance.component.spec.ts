import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountbalanceComponent } from './accountbalance.component';

describe('AccountbalanceComponent', () => {
  let component: AccountbalanceComponent;
  let fixture: ComponentFixture<AccountbalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountbalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountbalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
