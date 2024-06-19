import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroPage } from './registro.page';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { Router } from '@angular/router';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;
  let authServiceStub: Partial<AuthService>;
  let firestoreServiceStub: Partial<FirestoreService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceStub = {
      register: (email: string, password: string) => Promise.resolve({ user: { email } })
    };

    firestoreServiceStub = {
      createDoc: (collection: string, data: any) => Promise.resolve()
    };

    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [ RegistroPage ],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: FirestoreService, useValue: firestoreServiceStub },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });
});
