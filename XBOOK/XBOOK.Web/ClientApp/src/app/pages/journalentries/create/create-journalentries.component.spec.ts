import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJournalComponent } from './create-journalentries.component';

describe('CreateClientComponent', () => {
  let component: CreateJournalComponent;
  let fixture: ComponentFixture<CreateJournalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateJournalComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
