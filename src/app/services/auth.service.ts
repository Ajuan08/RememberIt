import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  // Registro con email y contraseña
  register(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Inicio de sesión con email y contraseña
  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Cerrar sesión
  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  // Obtener usuario autenticado actual
  getCurrentUser(): Observable<User | null> {
    return this.afAuth.authState as Observable<User | null>;
  }

  // Obtener el correo electrónico del usuario autenticado actual
  getCurrentUserEmail(): string | null {
    const user = firebase.auth().currentUser;
    return user ? user.email : null;
  }

  // Enviar correo de restablecimiento de contraseña
  sendPasswordResetEmail(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }
}
