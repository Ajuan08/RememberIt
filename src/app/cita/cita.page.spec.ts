import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitaPage } from './cita.page';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { of } from 'rxjs';

describe('CitaPage', () => {
  let component: CitaPage;
  let fixture: ComponentFixture<CitaPage>;
  let authServiceStub: Partial<AuthService>;
  let firestoreServiceStub: Partial<FirestoreService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    authServiceStub = {
      getCurrentUserEmail: () => 'test@example.com'
    };

    firestoreServiceStub = {
      getCollection: (collection: string) => {
        if (collection === 'medicos') {
          return of([
            { payload: { doc: { id: '1', data: () => ({ nombre: 'Dr. Smith', especialidad: 'Cardiología' }) } } }
          ]);
        }
        return of([]);
      },
      createDoc: (collection: string, data: any) => Promise.resolve()
    };

    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [ CitaPage ],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: FirestoreService, useValue: firestoreServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: AlertController, useValue: alertControllerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('Debería cargar médicos al inicio', () => {
    component.ngOnInit();
    expect(component.medicos.length).toBeGreaterThan(0);
  });
});
