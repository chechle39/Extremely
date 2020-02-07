import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPurchaseReportComponent } from './searchpurchase-report.component';

describe('SearchgenledComponent', () => {
  let component: SearchPurchaseReportComponent;
  let fixture: ComponentFixture<SearchPurchaseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchPurchaseReportComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPurchaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
