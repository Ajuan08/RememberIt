import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  // Crear un nuevo documento
  createDoc(collection: string, data: any): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection(collection).doc(id).set(data);
  }

  // Leer todos los documentos de una colección
  getCollection(collection: string): Observable<any[]> {
    return this.firestore.collection(collection).snapshotChanges();
  }

  // Leer un solo documento
  getDoc(collection: string, id: string): Observable<any> {
    return this.firestore.collection(collection).doc(id).valueChanges();
  }

  // Obtener el documento del perfil del usuario actual
  getUserProfile(email: string): Observable<any> {
    return this.firestore.collection('perfiles', ref => ref.where('email', '==', email)).valueChanges();
  }

  // Actualizar un documento
  updateDoc(collection: string, id: string, data: any): Promise<void> {
    return this.firestore.collection(collection).doc(id).update(data);
  }

  // Eliminar un documento
  deleteDoc(collection: string, id: string): Promise<void> {
    return this.firestore.collection(collection).doc(id).delete();
  }

  // Actualizar el perfil del usuario
  updateUserProfile(email: string, data: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.firestore.collection('perfiles', ref => ref.where('email', '==', email)).get().subscribe(profile => {
        if (profile && profile.docs.length > 0) {
          this.firestore.collection('perfiles').doc(profile.docs[0].id).update(data).then(resolve).catch(reject);
        } else {
          this.firestore.collection('perfiles').add(data).then(() => resolve()).catch(reject);
        }
      });
    });
  }

  // Subir la imagen de perfil
  uploadProfileImage(file: File, email: string): Observable<string> {
    const filePath = `profile_images/${email}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Observable<string>((observer) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(downloadURL => {
            this.updateUserProfile(email, { profileImageUrl: downloadURL }).then(() => {
              observer.next(downloadURL);
              observer.complete();
            }).catch(error => observer.error(error));
          });
        })
      ).subscribe();
    });
  }
}
