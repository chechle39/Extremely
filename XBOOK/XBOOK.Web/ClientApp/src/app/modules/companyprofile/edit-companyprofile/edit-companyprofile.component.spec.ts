import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanyprofileComponent } from './edit-companyprofile.component';

describe('EditClientComponent', () => {
  let component: EditCompanyprofileComponent;
  let fixture: ComponentFixture<EditCompanyprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCompanyprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
