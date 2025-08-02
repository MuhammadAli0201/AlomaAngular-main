import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutcomeReportComponent } from './outcome-report.component';

describe('OutcomeReportComponent', () => {
  let component: OutcomeReportComponent;
  let fixture: ComponentFixture<OutcomeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutcomeReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutcomeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
