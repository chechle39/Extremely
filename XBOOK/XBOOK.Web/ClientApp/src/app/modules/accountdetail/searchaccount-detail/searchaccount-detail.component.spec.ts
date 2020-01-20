import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAccountDetailComponent } from './searchaccount-detail.component';

describe('SearchgenledComponent', () => {
  let component: SearchAccountDetailComponent;
  let fixture: ComponentFixture<SearchAccountDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchAccountDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
