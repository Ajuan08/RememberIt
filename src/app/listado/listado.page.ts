import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { EditarMedicamentoPage } from '../editar-medicamento/editar-medicamento.page';
import { EditarCitaPage } from '../editar-cita/editar-cita.page';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
})
export class ListadoPage implements OnInit {
  formatDate: any;
  getDate(date: Date) {
    throw new Error('Method not implemented.');
  }
  email: string | null = '';
  citas: any[] = [];
  medicamentos: any[] = [];
  today: string = new Date().toISOString();

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.email = this.authService.getCurrentUserEmail();
    this.loadCitas();
    this.loadMedicamentos();
  }

  loadCitas() {
    this.firestoreService.getCollection('citas').subscribe(data => {
      this.citas = data.map(e => {
        const cita = e.payload.doc.data();
        cita.id = e.payload.doc.id;
        return cita;
      }).filter(cita => cita.email === this.email && cita.fechaHora > this.today);
    });
  }

  loadMedicamentos() {
    this.firestoreService.getCollection('medicamentos').subscribe(data => {
      this.medicamentos = data.map(e => {
        const medicamento = e.payload.doc.data();
        medicamento.id = e.payload.doc.id;
        return medicamento;
      }).filter(medicamento => medicamento.email === this.email && medicamento.fechaFin > this.today);
    });
  }

  async openEditarMedicamento(medicamento: any) {
    const modal = await this.modalController.create({
      component: EditarMedicamentoPage,
      componentProps: { medicamento }
    });
    return await modal.present();
  }

  async openEditarCita(cita: any) {
    const modal = await this.modalController.create({
      component: EditarCitaPage,
      componentProps: { cita }
    });
    return await modal.present();
  }
}
