import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpResoucesComponent } from './help-resouces.component';

describe('HelpResoucesComponent', () => {
  let component: HelpResoucesComponent;
  let fixture: ComponentFixture<HelpResoucesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpResoucesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpResoucesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
