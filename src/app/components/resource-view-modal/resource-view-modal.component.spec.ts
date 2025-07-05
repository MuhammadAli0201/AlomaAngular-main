import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceViewModalComponent } from './resource-view-modal.component';

describe('ResourceViewModalComponent', () => {
  let component: ResourceViewModalComponent;
  let fixture: ComponentFixture<ResourceViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceViewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
