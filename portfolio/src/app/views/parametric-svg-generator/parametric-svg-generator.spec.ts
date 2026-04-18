import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametricSvgGenerator } from './parametric-svg-generator';

describe('ParametricSvgGenerator', () => {
  let component: ParametricSvgGenerator;
  let fixture: ComponentFixture<ParametricSvgGenerator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametricSvgGenerator],
    }).compileComponents();

    fixture = TestBed.createComponent(ParametricSvgGenerator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
