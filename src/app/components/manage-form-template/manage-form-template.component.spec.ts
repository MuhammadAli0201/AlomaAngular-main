import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFormTemplateComponent } from './manage-form-template.component';

describe('ManageFormTemplateComponent', () => {
  let component: ManageFormTemplateComponent;
  let fixture: ComponentFixture<ManageFormTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageFormTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageFormTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
