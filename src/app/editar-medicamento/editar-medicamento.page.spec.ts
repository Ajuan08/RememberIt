import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarMedicamentoPage } from './editar-medicamento.page';
import { ModalController, NavParams } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';
import { of } from 'rxjs';

describe('EditarMedicamentoPage', () => {
  let component: EditarMedicamentoPage;
  let fixture: ComponentFixture<EditarMedicamentoPage>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let navParamsSpy: jasmine.SpyObj<NavParams>;
  let firestoreServiceStub: Partial<FirestoreService>;

  beforeEach(async () => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    navParamsSpy = jasmine.createSpyObj('NavParams', ['get']);
    firestoreServiceStub = {
      updateDoc: (collection: string, id: string, data: any) => Promise.resolve(),
      deleteDoc: (collection: string, id: string) => Promise.resolve()
    };

    navParamsSpy.get.and.returnValue({
      id: '1',
      nombreMedicamento: 'Medicamento A',
      fechaInicio: new Date().toISOString(),
      fechaFin: new Date().toISOString()
    });

    await TestBed.configureTestingModule({
      declarations: [ EditarMedicamentoPage ],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: NavParams, useValue: navParamsSpy },
        { provide: FirestoreService, useValue: firestoreServiceStub }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarMedicamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('Debería cerrar el modal', () => {
    component.closeModal();
    expect(modalControllerSpy.dismiss).toHaveBeenCalled();
  });
});
