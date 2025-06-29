import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HabitosPage } from './habitos.page';

describe('HabitosPage', () => {
  let component: HabitosPage;
  let fixture: ComponentFixture<HabitosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
