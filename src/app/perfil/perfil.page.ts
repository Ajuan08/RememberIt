import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { LocalNotifications } from '@capacitor/local-notifications';

interface UserProfile {
  nombre: string;
  edad: number;
  genero: string;
  profileImageUrl?: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  email: string | null = '';
  nombre?: string;
  edad?: number;
  genero?: string;
  profileImageUrl?: string;
  selectedFile?: File;

  isEditing = false;
  editNombre?: string;
  editEdad?: number;
  editGenero?: string;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  ngOnInit() {
    this.email = this.authService.getCurrentUserEmail();
    if (this.email) {
      this.firestoreService.getUserProfile(this.email).subscribe(profile => {
        if (profile && profile.length > 0) {
          this.nombre = profile[0].nombre;
          this.edad = profile[0].edad;
          this.genero = profile[0].genero;
          this.profileImageUrl = profile[0].profileImageUrl;

          // Inicializar los campos de edición
          this.editNombre = this.nombre;
          this.editEdad = this.edad;
          this.editGenero = this.genero;
        }
      });
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    if (this.email && this.editNombre && this.editEdad !== undefined && this.editGenero) {
      const updateData: UserProfile = {
        nombre: this.editNombre,
        edad: this.editEdad,
        genero: this.editGenero,
      };

      const updateProfile = () => {
        this.firestoreService.updateUserProfile(this.email!, updateData).then(async () => {
          // Actualizar el perfil mostrado
          this.nombre = this.editNombre;
          this.edad = this.editEdad;
          this.genero = this.editGenero;

          // Cerrar el formulario de edición
          this.isEditing = false;

          // Lanzar la notificación
          await LocalNotifications.schedule({
            notifications: [
              {
                title: "Perfil Actualizado",
                body: "Se ha modificado el perfil",
                id: 1,
                schedule: { at: new Date(Date.now() + 1000) },
                sound: "../../android/app/src/main/res/raw/beep.wav",
                attachments: undefined,
                actionTypeId: "",
                extra: null
              }
            ]
          });
        });
      };

      if (this.selectedFile) {
        this.firestoreService.uploadProfileImage(this.selectedFile, this.email).subscribe(downloadURL => {
          updateData.profileImageUrl = downloadURL;
          updateProfile();
        });
      } else {
        updateProfile();
      }
    }
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/login');
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
