import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJournalComponent } from './update-journalentries.component';

describe('CreateClientComponent', () => {
  let component: EditJournalComponent;
  let fixture: ComponentFixture<EditJournalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditJournalComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
