import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WashingtonEmployment } from './washington-employment';

describe('WashingtonEmployment', () => {
  let component: WashingtonEmployment;
  let fixture: ComponentFixture<WashingtonEmployment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WashingtonEmployment],
    }).compileComponents();

    fixture = TestBed.createComponent(WashingtonEmployment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
