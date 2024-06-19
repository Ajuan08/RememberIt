import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { of } from 'rxjs';
import { FirestoreService } from './firestore.service';

describe('FirestoreService', () => {
  let service: FirestoreService;
  let firestoreSpy: jasmine.SpyObj<AngularFirestore>;
  let storageSpy: jasmine.SpyObj<AngularFireStorage>;

  beforeEach(() => {
    const firestoreSpyObj = jasmine.createSpyObj('AngularFirestore', ['collection', 'doc']);
    const storageSpyObj = jasmine.createSpyObj('AngularFireStorage', ['ref', 'upload']);

    TestBed.configureTestingModule({
      providers: [
        FirestoreService,
        { provide: AngularFirestore, useValue: firestoreSpyObj },
        { provide: AngularFireStorage, useValue: storageSpyObj }
      ]
    });

    service = TestBed.inject(FirestoreService);
    firestoreSpy = TestBed.inject(AngularFirestore) as jasmine.SpyObj<AngularFirestore>;
    storageSpy = TestBed.inject(AngularFireStorage) as jasmine.SpyObj<AngularFireStorage>;
  });

  it('Debería crearse', () => {
    expect(service).toBeTruthy();
  });
});
