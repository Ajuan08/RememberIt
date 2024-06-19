import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CalendarioPage } from './calendario.page';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

describe('CalendarioPage', () => {
  let component: CalendarioPage;
  let fixture: ComponentFixture<CalendarioPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let firestoreServiceSpy: jasmine.SpyObj<FirestoreService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUserEmail']);
    const firestoreSpy = jasmine.createSpyObj('FirestoreService', ['getCollection']);

    await TestBed.configureTestingModule({
      declarations: [ CalendarioPage ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: FirestoreService, useValue: firestoreSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioPage);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    firestoreServiceSpy = TestBed.inject(FirestoreService) as jasmine.SpyObj<FirestoreService>;

    authServiceSpy.getCurrentUserEmail.and.returnValue('test@example.com');
    firestoreServiceSpy.getCollection.and.returnValue(of([]));
  });

  it('Deberia crearse', () => {
    expect(component).toBeTruthy();
  });

  it('Deberia cargar citas al inicio', () => {
    const citasMock = [
      { payload: { doc: { data: () => ({ email: 'test@example.com', fechaHora: '2023-06-18T12:00:00Z' }), id: '1' } } }
    ];
    firestoreServiceSpy.getCollection.and.returnValue(of(citasMock));

    component.ngOnInit();

    expect(component.citas.length).toBe(1);
    expect(component.citas[0].email).toBe('test@example.com');
  });

  it('Deberia filtrar citas por la fecha seleccionada', () => {
    component.citas = [
      { email: 'test@example.com', fechaHora: '2023-06-18T12:00:00Z' },
      { email: 'test@example.com', fechaHora: '2023-06-19T12:00:00Z' }
    ];
    component.selectedDate = '2023-06-18T00:00:00Z';
    component.filterItemsForSelectedDate();

    expect(component.citasDelDia.length).toBe(1);
    expect(component.citasDelDia[0].fechaHora).toBe('2023-06-18T12:00:00Z');
  });
});
