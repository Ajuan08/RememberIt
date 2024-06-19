import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-cita',
  templateUrl: './cita.page.html',
  styleUrls: ['./cita.page.scss'],
})
export class CitaPage implements OnInit {
  email: string | null = '';
  medicos: any[] = [];
  selectedMedico: any;
  fechaHora: string = '';
  today: string = new Date().toISOString().split('T')[0] + 'T' + new Date().toISOString().split('T')[1].slice(0, 5);

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.email = this.authService.getCurrentUserEmail();
    this.fechaHora = this.today;  // Establecer fechaHora a la fecha y hora actual por defecto
    this.loadMedicos();
  }

  loadMedicos() {
    this.firestoreService.getCollection('medicos').subscribe(data => {
      this.medicos = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
    });
  }

  async addCita() {
    if (this.email && this.selectedMedico && this.fechaHora) {
      const cita = {
        email: this.email,
        medico: this.selectedMedico,
        fechaHora: this.fechaHora
      };
  
      const addNewCita = async () => {
        try {
          await this.firestoreService.createDoc('citas', cita);
          console.log('Cita añadida');
          this.presentConfirmationAlert();
  
          // Calcular el tiempo para la notificación (2 horas antes de la cita)
          const citaDate = new Date(this.fechaHora);
          const notificationTime = new Date(citaDate.getTime() - 2 * 60 * 60 * 1000); // 2 horas en milisegundos
  
          // Lanzar la notificación
          await LocalNotifications.schedule({
            notifications: [
              {
                title: "Cita Próxima",
                body: "Tu cita es en menos de 2 horas con el Dr. " + this.selectedMedico.nombre,
                id: 1,
                schedule: { at: notificationTime },
                sound: "../../android/app/src/main/res/raw/beep.wav",
                attachments: undefined,
                actionTypeId: "",
                extra: null
              }
            ]
          });
        } catch (err) {
          console.error('Error al añadir la cita:', err);
        }
      };
  
      addNewCita();
    } else {
      console.error('Todos los campos son requeridos');
    }
  }
  
  

  async presentConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: 'La cita ha sido añadida correctamente.',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.router.navigateByUrl('/tabs/listado');
          }
        }
      ]
    });
    await alert.present();
  }
}
