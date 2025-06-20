import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaternalComponent } from './maternal.component';

describe('MaternalComponent', () => {
  let component: MaternalComponent;
  let fixture: ComponentFixture<MaternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaternalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
