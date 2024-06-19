import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { of } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceStub: Partial<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    authServiceStub = {
      login: (email: string, password: string) => Promise.resolve({ user: { email } }),
      sendPasswordResetEmail: (email: string) => Promise.resolve()
    };

    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: AlertController, useValue: alertControllerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería Crearse', () => {
    expect(component).toBeTruthy();
  });

  it('Cuando loguee debería navegar a tabs', async () => {
    component.email = 'test@example.com';
    component.password = '123456';
    await component.login();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/tabs');
  });

  it('Debería enseñar la alaerta', async () => {
    component.email = 'test@example.com';
    alertControllerSpy.create.and.returnValue(Promise.resolve({
      present: () => Promise.resolve()
    } as any));
    await component.forgotPassword();
    expect(alertControllerSpy.create).toHaveBeenCalled();
  });
});
