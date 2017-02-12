/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DynamicDirective } from './dynamic.component';

describe('DynamicComponent', () => {
  let component: DynamicDirective;
  let fixture: ComponentFixture<DynamicDirective>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicDirective ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
