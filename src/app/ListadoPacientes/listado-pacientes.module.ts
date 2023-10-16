import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListadoPacientesComponent } from './listado-pacientes.component';
import { PacienteComponent } from './components/paciente/paciente.component';



@NgModule({
  declarations: [
    ListadoPacientesComponent,
    PacienteComponent
  ],
  exports: [
    ListadoPacientesComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ListadoPacientesModule { }
