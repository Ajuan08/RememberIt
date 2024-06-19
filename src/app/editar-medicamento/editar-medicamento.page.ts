import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-editar-medicamento',
  templateUrl: './editar-medicamento.page.html',
  styleUrls: ['./editar-medicamento.page.scss'],
})
export class EditarMedicamentoPage implements OnInit {
  @Input() medicamento: any;

  constructor(
    private modalController: ModalController,
    private firestoreService: FirestoreService,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.medicamento = this.navParams.get('medicamento');
  }

  closeModal() {
    this.modalController.dismiss();
  }

  updateMedicamento() {
    this.firestoreService.updateDoc('medicamentos', this.medicamento.id, this.medicamento).then(() => {
      this.closeModal();
    });
  }

  deleteMedicamento() {
    this.firestoreService.deleteDoc('medicamentos', this.medicamento.id).then(() => {
      this.closeModal();
    });
  }
}
