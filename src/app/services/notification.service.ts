import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  startNotificationScheduler() {
    setInterval(() => {
      this.checkForUpcomingAppointments();
    }, 60000); // Verificar cada minuto
  }

  private async checkForUpcomingAppointments() {
    const userEmail = await this.authService.getCurrentUserEmail();
    if (userEmail) {
      const now = new Date();
      const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      this.firestore.collection<Cita>('citas', ref =>
        ref.where('email', '==', userEmail).where('fechaHora', '>=', now.toISOString()).where('fechaHora', '<=', twoHoursLater.toISOString())
      ).get().subscribe(snapshot => {
        snapshot.forEach(doc => {
          const data = doc.data() as Cita;
          const fechaHora = new Date(data.fechaHora);

          if (fechaHora.getTime() - now.getTime() <= 2 * 60 * 60 * 1000 && fechaHora > now) {
            LocalNotifications.schedule({
              notifications: [
                {
                  title: "HOLAAAAAAAAA",
                  body: "adisosssss",
                  id: 1,
                  schedule: { at: new Date(Date.now() + 1000) },
                  sound: "../../android/app/src/main/res/raw/beep.wav",
                  attachments: undefined,
                  actionTypeId: "",
                  extra: null
                }
              ]
            });
          }
        });
      });
    }
  }
}

interface Cita {
  email: string;
  fechaHora: string; // Asegúrate de que el campo coincida con el nombre en Firestore
}
