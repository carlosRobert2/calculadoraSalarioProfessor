import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';

import { Calc } from './calc';

describe('Calc', () => {
  let component: Calc;
  let fixture: ComponentFixture<Calc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calc],
      providers: [provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(Calc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
