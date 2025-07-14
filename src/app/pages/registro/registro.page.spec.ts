import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegistroPage } from './registro.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AuthenService } from 'src/app/services/authen.service';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;
  let router: any;

  // ✅ Mock para Storage
  const storageMock = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),
    get: jasmine.createSpy('get').and.returnValue(Promise.resolve(null)),
    set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
    remove: jasmine.createSpy('remove').and.returnValue(Promise.resolve()),
  };

  // ✅ Mock para AlertController
  const alertSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
  const alertControllerMock = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve(alertSpy)),
  };

  // ✅ Mock para SqliteService
  const sqliteServiceMock = {
    existeUsuario: jasmine.createSpy('existeUsuario').and.returnValue(Promise.resolve(false)),
    registrarUsuario: jasmine.createSpy('registrarUsuario').and.returnValue(Promise.resolve()),
    getDB: jasmine.createSpy('getDB').and.returnValue(Promise.resolve({
      query: jasmine.createSpy('query').and.returnValue(Promise.resolve({
        values: [{ correo: 'test@example.com', nombre: 'Test User' }]
      }))
    }))
  };

  // ✅ Mock para AuthenService
  const authServiceMock = {
    login: jasmine.createSpy('login').and.callFake(async (correo: string, clave: string) => {
      // Simula almacenamiento tras login
      await storageMock.set('usuario', { correo });
      return { correo };
    }),
    logout: jasmine.createSpy('logout').and.returnValue(Promise.resolve()),
    isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(Promise.resolve(true)),
    getUsuario: jasmine.createSpy('getUsuario').and.returnValue(Promise.resolve({ correo: 'test@example.com' })),
  };

  const navCtrlMock = {
    navigateRoot: jasmine.createSpy('navigateRoot'),
  };

  beforeEach(waitForAsync(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [RegistroPage],
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule, IonicModule.forRoot()],
      providers: [
        { provide: AlertController, useValue: alertControllerMock },
        { provide: SqliteService, useValue: sqliteServiceMock },
        { provide: NavController, useValue: navCtrlMock },
        { provide: Router, useValue: router },
        { provide: Storage, useValue: storageMock },
        { provide: AuthenService, useValue: authServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('debería crearse la página de registro', () => {
    expect(component).toBeTruthy();
  });

  it('debería marcar el formulario como inválido si está vacío', () => {
    component.registerForm.setValue({
      nombre: '',
      genero: '',
      fecha_nacimiento: '',
      correo: '',
      clave: '',
    });
    expect(component.registerForm.valid).toBeFalse();
  });

  it('debería registrar usuario y navegar a /home si el correo no existe', async () => {
    sqliteServiceMock.existeUsuario.and.returnValue(Promise.resolve(false));
    sqliteServiceMock.registrarUsuario.and.returnValue(Promise.resolve());

    component.registerForm.setValue({
      nombre: 'Test User',
      genero: 'Otro',
      fecha_nacimiento: '2000-01-01',
      correo: 'test@example.com',
      clave: 'Contra3!',
    });

    await component.onSubmit();

    expect(sqliteServiceMock.registrarUsuario).toHaveBeenCalledWith(
      'Test User',
      'Otro',
      '2000-01-01',
      'test@example.com',
      'Contra3!'
    );

    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', 'Contra3!');
    expect(router.navigate).toHaveBeenCalledWith(['tabs/home']);
  });

  it('debería mostrar alerta si el correo ya está registrado', async () => {
    sqliteServiceMock.existeUsuario.and.returnValue(Promise.resolve(true));
    sqliteServiceMock.registrarUsuario.calls.reset();

    component.registerForm.setValue({
      nombre: 'Duplicador',
      genero: 'Otro',
      fecha_nacimiento: '1999-12-31',
      correo: 'test@example.com',
      clave: 'Contra4!',
    });

    await component.onSubmit();

    expect(sqliteServiceMock.registrarUsuario).not.toHaveBeenCalled();
    expect(alertControllerMock.create).toHaveBeenCalled();
    expect(alertSpy.present).toHaveBeenCalled();
  });
});