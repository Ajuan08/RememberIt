import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicamentoPage } from './medicamento.page';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { Router } from '@angular/router';
import { PickerController, AlertController } from '@ionic/angular';
import { of } from 'rxjs';

describe('MedicamentoPage', () => {
  let component: MedicamentoPage;
  let fixture: ComponentFixture<MedicamentoPage>;
  let authServiceStub: Partial<AuthService>;
  let firestoreServiceStub: Partial<FirestoreService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let pickerControllerSpy: jasmine.SpyObj<PickerController>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    authServiceStub = {
      getCurrentUserEmail: () => 'test@example.com'
    };

    firestoreServiceStub = {
      createDoc: (collection: string, data: any) => Promise.resolve()
    };

    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    pickerControllerSpy = jasmine.createSpyObj('PickerController', ['create']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [ MedicamentoPage ],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: FirestoreService, useValue: firestoreServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: PickerController, useValue: pickerControllerSpy },
        { provide: AlertController, useValue: alertControllerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('Debería abrirse', async () => {
    pickerControllerSpy.create.and.returnValue(Promise.resolve({
      present: () => Promise.resolve()
    } as any));
    await component.openPicker();
    expect(pickerControllerSpy.create).toHaveBeenCalled();
  });
});
