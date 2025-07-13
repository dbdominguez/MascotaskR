import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HabitosPage } from './habitos.page';
import { SqliteService } from 'src/app/services/sqlite.service';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { FormsModule } from '@angular/forms';
import { LocalNotifications } from '@capacitor/local-notifications';

// Mock manual antes de cualquier uso
(LocalNotifications as any).schedule = jasmine.createSpy('schedule').and.returnValue(Promise.resolve());
(LocalNotifications as any).cancel = jasmine.createSpy('cancel').and.returnValue(Promise.resolve());
(LocalNotifications as any).requestPermissions = jasmine.createSpy('requestPermissions').and.returnValue(Promise.resolve({ display: 'granted' }));
(LocalNotifications as any).getPending = jasmine.createSpy('getPending').and.returnValue(Promise.resolve([]));

describe('HabitosPage', () => {
  let component: HabitosPage;
  let fixture: ComponentFixture<HabitosPage>;

  const sqliteServiceMock = {
    agregarHabito: jasmine.createSpy('agregarHabito').and.returnValue(Promise.resolve(1)),
    obtenerHabitosHoy: jasmine.createSpy('obtenerHabitosHoy').and.returnValue(Promise.resolve([])),
    editarHabito: jasmine.createSpy('editarHabito').and.returnValue(Promise.resolve()),
    eliminarHabito: jasmine.createSpy('eliminarHabito').and.returnValue(Promise.resolve())
  };

  const storageMock = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),
    get: jasmine.createSpy('get').and.callFake(async (key: string) => {
      if (key === 'notificacionesActivas') return true;
      return null;
    }),
  };

  // ✅ Declarar la variable del spy para verificar luego
  let scheduleSpy: jasmine.Spy;

beforeEach(waitForAsync(() => {
  TestBed.configureTestingModule({
    declarations: [HabitosPage],
    imports: [IonicModule.forRoot(), FormsModule],
    providers: [
      { provide: SqliteService, useValue: sqliteServiceMock },
      { provide: Storage, useValue: storageMock }
    ]
  }).compileComponents();
}));

beforeEach(() => {
  fixture = TestBed.createComponent(HabitosPage);
  component = fixture.componentInstance;

  // Mocks de LocalNotifications
  spyOn(LocalNotifications, 'requestPermissions').and.returnValue(Promise.resolve({ display: 'granted' }));
  scheduleSpy = spyOn(LocalNotifications, 'schedule').and.returnValue(Promise.resolve({ notifications: [] }));

  fixture.detectChanges();
});

  it('debería crearse la página de hábitos', () => {
    expect(component).toBeTruthy();
  });

  it('debería abrir el formulario y limpiar campos', () => {
    component.abrirFormulario();
    expect(component.formularioVisible).toBeTrue();
    expect(component.nuevoHabito.nombre).toBe('');
    expect(component.modoEdicion).toBeFalse();
  });

it('debería guardar un nuevo hábito y programar notificación', async () => {
  component.nuevoHabito = {
    nombre: 'Correr',
    categoria: '💪 Ejercicio',
    dias: ['Lunes', 'Miércoles'],
    hora: '12:00',
    completado: false
  };

  const programarSpy = spyOn(component, 'programarNotificacion').and.returnValue(Promise.resolve());

  await component.guardarHabito();

  expect(sqliteServiceMock.agregarHabito).toHaveBeenCalledWith({
    nombre: 'Correr',
    categoria: '💪 Ejercicio',
    dias: ['Lunes', 'Miércoles'],
    hora: '12:00',
  });

  expect(programarSpy).toHaveBeenCalled();

  expect(component.nuevoHabito.nombre).toBe('');
});
});