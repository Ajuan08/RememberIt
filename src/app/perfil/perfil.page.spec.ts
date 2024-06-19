import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilPage } from './perfil.page';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;
  let authServiceStub: Partial<AuthService>;
  let firestoreServiceStub: Partial<FirestoreService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceStub = {
      getCurrentUserEmail: () => 'test@example.com',
      logout: () => Promise.resolve()
    };

    firestoreServiceStub = {
      getUserProfile: (email: string) => of([
        { nombre: 'Ajuan', edad: 30, genero: 'Masculino', profileImageUrl: 'https://example.com/image.jpg' }
      ]),
      updateUserProfile: (email: string, data: any) => Promise.resolve()
    };

    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [ PerfilPage ],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: FirestoreService, useValue: firestoreServiceStub },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('Debería cargar el perfil al inicio', () => {
    component.ngOnInit();
    expect(component.nombre).toBe('Ajuan');
    expect(component.edad).toBe(30);
    expect(component.genero).toBe('Masculino');
    expect(component.profileImageUrl).toBe('https://example.com/image.jpg');
  });

  it('Cuando te deslogueas debería mandarte al login', async () => {
    await component.logout();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
