import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSystemComponent } from './manage-system.component';

describe('ManageSystemComponent', () => {
  let component: ManageSystemComponent;
  let fixture: ComponentFixture<ManageSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageSystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
