import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { ListadoPage } from './listado.page';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

describe('ListadoPage', () => {
  let component: ListadoPage;
  let fixture: ComponentFixture<ListadoPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let firestoreServiceSpy: jasmine.SpyObj<FirestoreService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUserEmail']);
    const firestoreSpy = jasmine.createSpyObj('FirestoreService', ['getCollection']);

    await TestBed.configureTestingModule({
      declarations: [ListadoPage],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: FirestoreService, useValue: firestoreSpy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    firestoreServiceSpy = TestBed.inject(FirestoreService) as jasmine.SpyObj<FirestoreService>;

    firestoreServiceSpy.getCollection.and.returnValue(of([]));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoPage);
    component = fixture.componentInstance;
    authServiceSpy.getCurrentUserEmail.and.returnValue('test@example.com');
    fixture.detectChanges();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });
});
