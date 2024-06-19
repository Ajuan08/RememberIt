import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  login() {
    this.authService.login(this.email, this.password).then(
      res => {
        console.log('Usuario logueado:', res);
        this.router.navigateByUrl('/tabs');
      },
      err => {
        console.error('Error al iniciar sesión:', err);
        // Mostrar mensaje de error al usuario
      }
    );
  }

  async forgotPassword() {
    try {
      await this.authService.sendPasswordResetEmail(this.email);
      const alert = await this.alertController.create({
        header: '¡Correo enviado!',
        message: 'Se ha enviado un mensaje a tu correo electrónico para restablecer tu contraseña.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento de contraseña:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ha ocurrido un error al enviar el correo de restablecimiento de contraseña. Por favor, inténtalo de nuevo más tarde.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
