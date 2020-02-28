import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompanyprofileComponent } from './create-companyprofile.component';

describe('CreateClientComponent', () => {
  let component: CreateCompanyprofileComponent;
  let fixture: ComponentFixture<CreateCompanyprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCompanyprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCompanyprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
