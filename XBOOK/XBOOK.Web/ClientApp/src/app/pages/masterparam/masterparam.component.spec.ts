import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterParamComponent } from './masterparam.component';

describe('ClientsComponent', () => {
  let component: MasterParamComponent;
  let fixture: ComponentFixture<MasterParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
