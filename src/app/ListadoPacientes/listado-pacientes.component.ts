import {Component, inject, OnInit} from '@angular/core';
import {PacientesService} from "../services/pacientes.service";
import {Paciente} from "../interfaces/paciente.interface";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-listado-pacientes',
  templateUrl: './listado-pacientes.component.html',
  styleUrls: ['./listado-pacientes.component.css']
})
export class ListadoPacientesComponent implements OnInit{

  private pacientesService : PacientesService = inject(PacientesService);

  public pacientesList : Paciente[] = [];

  public deleteItemSubscription ?: Subscription;
  public addItemSubscription    ?: Subscription;

  ngOnInit() : void {

    this.getItems();

    // Escucha el evento de edición exitosa
    this.pacientesService.editSuccess
      .subscribe( success => {
        if(success) {
          this.getItems();
        }
      })

    // Se actualiza el componente cuando se elimina un paciente/item
    this.deleteItemSubscription = this.pacientesService.getDeleteItemObservable()
      .subscribe( () => {
        this.getItems();
      })

    // Actualiza el componente cuando es insertado un nuevo paciente/item
    this.addItemSubscription = this.pacientesService.getAddItemObservable()
      .subscribe( () => {
        this.getItems();
      })

  }

  // Extrae la lista de pacientes del servicio y es guardada en un array para su uso local del componente
  getItems() : void {
    this.pacientesService.getPacientes()
      .subscribe( pacientes => {
        // Pone los items extraidos en un array local.
        this.pacientesList = pacientes;
      })
  }

  updatePaciente( paciente : Paciente ) {

    // this.pacientesService.getPacienteById(id)
    //   .subscribe( paciente => {
    //
    //     // TODO: consumir el servicio para enviar los datos al formulario.
    //     this.pacientesService.getForm(paciente);
    //   })

    this.pacientesService.setSelectedItem(paciente)
  }

  // Elimina un paciente de la lista
  onDelete( id : string ) {

    this.pacientesService.deletePaciente(id)
      .subscribe()
  }

}
