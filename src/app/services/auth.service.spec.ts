import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { User } from 'firebase/auth';

describe('AuthService', () => {
  let service: AuthService;
  let afAuth: AngularFireAuth;

  beforeEach(() => {
    const afAuthStub = {
      createUserWithEmailAndPassword: (email: string, password: string) => Promise.resolve({ user: { email } }),
      signInWithEmailAndPassword: (email: string, password: string) => Promise.resolve({ user: { email } }),
      signOut: () => Promise.resolve(),
      authState: of({ email: 'test@example.com' } as User),
      sendPasswordResetEmail: (email: string) => Promise.resolve()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AngularFireAuth, useValue: afAuthStub },
        { provide: 'firebase', useValue: {} },
        { provide: 'angularfire2.app.options', useValue: {} }
      ]
    });
    service = TestBed.inject(AuthService);
    afAuth = TestBed.inject(AngularFireAuth);
  });

  it('Debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('Debería registrar el usuario y la contraseña', async () => {
    const email = 'test@example.com';
    const password = '123456';
    const result = await service.register(email, password);
    expect(result.user.email).toBe(email);
  });

  it('Debería loguear con usuario y contraseña', async () => {
    const email = 'test@example.com';
    const password = '123456';
    const result = await service.login(email, password);
    expect(result.user.email).toBe(email);
  });

  it('Debería desloguearse', async () => {
    const result = await service.logout();
    expect(result).toBeUndefined();
  });

  it('Debería enviar un correo para restablecer el email', async () => {
    const email = 'test@example.com';
    const result = await service.sendPasswordResetEmail(email);
    expect(result).toBeUndefined();
  });

  it('Debería devolver el usuario actual como observable', (done) => {
    service.getCurrentUser().subscribe(user => {
      expect(user?.email).toBe('test@example.com');
      done();
    });
  });
});
