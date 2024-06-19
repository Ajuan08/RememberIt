import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import * as moment from 'moment';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {
  email: string | null = '';
  citas: any[] = [];
  medicamentos: any[] = [];
  selectedDate: string = new Date().toISOString();
  citasDelDia: any[] = [];
  medicamentosDelDia: any[] = [];

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
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
      }).filter(cita => cita.email === this.email);
      this.filterItemsForSelectedDate();
    });
  }

  loadMedicamentos() {
    this.firestoreService.getCollection('medicamentos').subscribe(data => {
      this.medicamentos = data.map(e => {
        const medicamento = e.payload.doc.data();
        medicamento.id = e.payload.doc.id;
        return medicamento;
      }).filter(medicamento => medicamento.email === this.email);
      this.filterItemsForSelectedDate();
    });
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    this.filterItemsForSelectedDate();
  }

  filterItemsForSelectedDate() {
    const selected = moment(this.selectedDate).startOf('day');
    this.citasDelDia = this.citas.filter(cita => {
      const citaDate = moment(cita.fechaHora);
      return citaDate.isSame(selected, 'day');
    });

    this.medicamentosDelDia = this.medicamentos.filter(medicamento => {
      const startDate = moment(medicamento.fechaInicio).startOf('day');
      const endDate = moment(medicamento.fechaFin).startOf('day');
      return selected.isBetween(startDate, endDate, 'day', '[]');
    });
  }
}
