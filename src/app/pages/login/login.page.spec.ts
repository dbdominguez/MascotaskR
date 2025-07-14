import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { LoginPage } from './login.page';
import { AuthenService } from 'src/app/services/authen.service';
import { NavController } from '@ionic/angular';

// Creamos un mock para AuthenService
class MockAuthenService {
  login = jasmine.createSpy('login').and.returnValue(Promise.resolve());
}

// Mock para Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

// Mock para LoadingController
class MockLoadingController {
  async create() {
    return {
      present: async () => {},
      dismiss: async () => {}
    };
  }
}

const storageMock = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),
  get: jasmine.createSpy('get').and.returnValue(Promise.resolve(null)),
  set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
  remove: jasmine.createSpy('remove').and.returnValue(Promise.resolve())
};

const navCtrlMock = {
  navigateRoot: jasmine.createSpy('navigateRoot')
};

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authService: AuthenService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, FormsModule],
      providers: [
        { provide: AuthenService, useClass: MockAuthenService },
        { provide: Router, useClass: MockRouter },
        { provide: LoadingController, useClass: MockLoadingController },
        { provide: Storage, useValue: storageMock },
        { provide: NavController, useValue: navCtrlMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debería crearse la página de login', () => {
    expect(component).toBeTruthy();
  });

  it('debería marcar el formulario como inválido si está vacío', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

it('debería ejecutar login y navegar al home si el formulario es válido', async () => {
  component.loginForm.setValue({ email: 'test@email.com', clave: 'Contra2!' });

  const fakeUser = { correo: 'test@email.com' };

  (authService.login as jasmine.Spy).and.returnValue(Promise.resolve(fakeUser));

  await component.ingresar();
  await fixture.whenStable();

  expect(router.navigate).toHaveBeenCalledWith(
    ['/tabs/home'],
    jasmine.objectContaining({
      state: jasmine.objectContaining({
        usuario: fakeUser
      })
    })
  );
});

});
