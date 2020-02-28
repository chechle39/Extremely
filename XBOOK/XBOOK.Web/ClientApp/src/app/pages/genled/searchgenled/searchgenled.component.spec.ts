import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchgenledComponent } from './searchgenled.component';

describe('SearchgenledComponent', () => {
  let component: SearchgenledComponent;
  let fixture: ComponentFixture<SearchgenledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchgenledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchgenledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
