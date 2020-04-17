import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMoneyFundComponent } from './searchcash-balance.component';

describe('SearchgenledComponent', () => {
  let component: SearchMoneyFundComponent;
  let fixture: ComponentFixture<SearchMoneyFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchMoneyFundComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMoneyFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
