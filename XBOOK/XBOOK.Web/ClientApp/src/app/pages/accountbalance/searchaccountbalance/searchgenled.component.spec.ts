import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchaccountbalanceComponent } from './searchgenled.component';

describe('SearchgenledComponent', () => {
  let component: SearchaccountbalanceComponent;
  let fixture: ComponentFixture<SearchaccountbalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchaccountbalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchaccountbalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
