import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportClientComponent } from './import-client.component';

describe('CreateClientComponent', () => {
  let component: ImportClientComponent;
  let fixture: ComponentFixture<ImportClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
