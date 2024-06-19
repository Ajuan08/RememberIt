import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarCitaPage } from './editar-cita.page';
import { ModalController, NavParams } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';
import { of } from 'rxjs';

describe('EditarCitaPage', () => {
  let component: EditarCitaPage;
  let fixture: ComponentFixture<EditarCitaPage>;
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
      medico: { nombre: 'Dr. Smith', especialidad: 'Cardiología' },
      fechaHora: new Date().toISOString()
    });

    await TestBed.configureTestingModule({
      declarations: [ EditarCitaPage ],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: NavParams, useValue: navParamsSpy },
        { provide: FirestoreService, useValue: firestoreServiceStub }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCitaPage);
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
