import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-editar-cita',
  templateUrl: './editar-cita.page.html',
  styleUrls: ['./editar-cita.page.scss'],
})
export class EditarCitaPage implements OnInit {
  @Input() cita: any;

  constructor(
    private modalController: ModalController,
    private firestoreService: FirestoreService,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.cita = this.navParams.get('cita');
  }

  closeModal() {
    this.modalController.dismiss();
  }

  updateCita() {
    this.firestoreService.updateDoc('citas', this.cita.id, this.cita).then(() => {
      this.closeModal();
    });
  }

  deleteCita() {
    this.firestoreService.deleteDoc('citas', this.cita.id).then(() => {
      this.closeModal();
    });
  }
}
