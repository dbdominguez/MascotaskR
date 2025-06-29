import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MascotaPage } from './mascota.page';

describe('MascotaPage', () => {
  let component: MascotaPage;
  let fixture: ComponentFixture<MascotaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MascotaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
