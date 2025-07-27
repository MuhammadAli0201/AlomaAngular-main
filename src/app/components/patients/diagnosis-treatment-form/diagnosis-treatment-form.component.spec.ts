import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisTreatmentFormComponent } from './diagnosis-treatment-form.component';

describe('DiagnosisTreatmentFormComponent', () => {
  let component: DiagnosisTreatmentFormComponent;
  let fixture: ComponentFixture<DiagnosisTreatmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiagnosisTreatmentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosisTreatmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
