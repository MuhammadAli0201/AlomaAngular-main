import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFullFormComponent } from './patient-full-form.component';

describe('PatientFullFormComponent', () => {
  let component: PatientFullFormComponent;
  let fixture: ComponentFixture<PatientFullFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientFullFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientFullFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
