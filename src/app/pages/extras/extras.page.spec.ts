import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtrasPage } from './extras.page';

describe('ExtrasPage', () => {
  let component: ExtrasPage;
  let fixture: ComponentFixture<ExtrasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
