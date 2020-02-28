import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMasterParamComponent } from './create-masterparam.component';

describe('CreateClientComponent', () => {
  let component: CreateMasterParamComponent;
  let fixture: ComponentFixture<CreateMasterParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMasterParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMasterParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
