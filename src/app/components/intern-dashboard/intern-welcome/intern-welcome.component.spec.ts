import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternWelcomeComponent } from './intern-welcome.component';

describe('InternWelcomeComponent', () => {
  let component: InternWelcomeComponent;
  let fixture: ComponentFixture<InternWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternWelcomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
