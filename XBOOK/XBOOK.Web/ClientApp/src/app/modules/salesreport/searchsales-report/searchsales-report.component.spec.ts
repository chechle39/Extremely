import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchsalesReportComponent } from './searchsales-report.component';

describe('SearchgenledComponent', () => {
  let component: SearchsalesReportComponent;
  let fixture: ComponentFixture<SearchsalesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchsalesReportComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchsalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
