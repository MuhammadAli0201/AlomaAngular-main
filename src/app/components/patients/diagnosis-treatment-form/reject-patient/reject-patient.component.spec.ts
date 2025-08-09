import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectPatientComponent } from './reject-patient.component';

describe('RejectPatientComponent', () => {
  let component: RejectPatientComponent;
  let fixture: ComponentFixture<RejectPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RejectPatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
