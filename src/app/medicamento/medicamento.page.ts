import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PickerController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-medicamento',
  templateUrl: './medicamento.page.html',
  styleUrls: ['./medicamento.page.scss'],
})
export class MedicamentoPage implements OnInit {
  email: string | null = '';
  nombreMedicamento: string = '';
  fechaFin: string = '';
  dosisDiarias: number = 1;
  anotaciones: string = '';
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router,
    private pickerController: PickerController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.email = this.authService.getCurrentUserEmail();
    this.fechaFin = this.today;  // Establecer fechaFin a la fecha actual por defecto
  }

  async openPicker() {
    const picker = await this.pickerController.create({
      columns: [
        {
          name: 'dosis',
          options: Array.from({ length: 10 }, (_, i) => ({ text: `${i + 1}`, value: i + 1 }))
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: (value) => {
            this.dosisDiarias = value.dosis.value;
          }
        }
      ]
    });
    await picker.present();
  }

  async addMedicamento() {
    if (this.email && this.nombreMedicamento && this.fechaFin && this.dosisDiarias > 0) {
      const medicamento = {
        email: this.email,
        nombreMedicamento: this.nombreMedicamento,
        fechaFin: this.fechaFin,
        dosisDiarias: this.dosisDiarias,
        anotaciones: this.anotaciones
      };
      try {
        await this.firestoreService.createDoc('medicamentos', medicamento);
        console.log('Medicamento añadido');
        this.presentConfirmationAlert();
  
        // Lanzar la notificación
        await LocalNotifications.schedule({
          notifications: [
            {
              title: "Medicamento Añadido",
              body: `Se ha añadido el medicamento ${this.nombreMedicamento} hasta el día ${this.fechaFin}`,
              id: 1,
              schedule: { at: new Date(Date.now() + 1000) }, // Notificación inmediata
              sound: "../../android/app/src/main/res/raw/beep.wav",
              attachments: undefined,
              actionTypeId: "",
              extra: null
            }
          ]
        });
      } catch (err) {
        console.error('Error al añadir el medicamento:', err);
        // Mostrar mensaje de error al usuario
      }
    } else {
      console.error('Todos los campos son requeridos');
      // Mostrar mensaje de error al usuario
    }
  }
  

  async presentConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: 'El medicamento ha sido añadido correctamente.',
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
