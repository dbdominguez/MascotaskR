export class SqliteServiceMock {
  registrarUsuario = jasmine.createSpy('registrarUsuario').and.returnValue(Promise.resolve());
  existeUsuario = jasmine.createSpy('existeUsuario').and.returnValue(Promise.resolve(false));
  agregarHabito = jasmine.createSpy('agregarHabito').and.returnValue(Promise.resolve(1));
  obtenerHabitosHoy = jasmine.createSpy('obtenerHabitosHoy').and.returnValue(Promise.resolve([]));
  
}
