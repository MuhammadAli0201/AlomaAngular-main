import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpResourceComponent } from './help-resource.component';

describe('HelpResourceComponent', () => {
  let component: HelpResourceComponent;
  let fixture: ComponentFixture<HelpResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpResourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
