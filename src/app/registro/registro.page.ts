import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  nombre?: string;
  email?: string;
  password?: string;
  edad?: number;
  genero?: string;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  register() {
    if (this.nombre && this.email && this.password && this.edad && this.genero) {
      this.authService.register(this.email, this.password).then(
        res => {
          console.log('Usuario registrado:', res);
          const userProfile = {
            nombre: this.nombre,
            email: this.email,
            edad: this.edad,
            genero: this.genero
          };
          this.firestoreService.createDoc('perfiles', userProfile).then(() => {
            console.log('Perfil guardado en Firestore');
            this.router.navigateByUrl('/login');
          }).catch(err => {
            console.error('Error al guardar el perfil en Firestore:', err);
          });
        },
        err => {
          console.error('Error al registrarse:', err);
          // Mostrar mensaje de error al usuario
        }
      );
    } else {
      console.error('Todos los campos son requeridos');
    }
  }

  login() {
    this.router.navigateByUrl('/login');
  }
}
