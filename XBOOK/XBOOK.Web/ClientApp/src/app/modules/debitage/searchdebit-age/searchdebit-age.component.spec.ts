import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDebitAgeComponent } from './searchdebit-age.component';

describe('SearchgenledComponent', () => {
  let component: SearchDebitAgeComponent;
  let fixture: ComponentFixture<SearchDebitAgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDebitAgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDebitAgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
