import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PacientesService} from "../services/pacientes.service";
import {Paciente} from "../interfaces/paciente.interface";

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit{

  // public pacienteForm : FormGroup = inject(FormGroup);
  public pacienteForm : FormGroup = new FormGroup ({});
  private readonly fb : FormBuilder = inject(FormBuilder);

  private pacientesService : PacientesService = inject(PacientesService);

  public errorFlag : Boolean = false;
  // Variable que guardara los datos del paciente el cual sera editado.
  public selectedItem : Paciente = {
    id        : '',
    namePet   : '',
    nameOwner : '',
    email     : '',
    date      : '',
    sintomas  : ''
  };

  ngOnInit() : void {

    this.initPacienteForm();

    this.pacientesService.selectedItem$.subscribe( item => {
      this.selectedItem = item;
      this.pacienteForm.patchValue(item);
    })
  }

  initPacienteForm() : void {

    this.pacienteForm = this.fb.group({

      namePet   : ['', [Validators.required]],
      nameOwner : ['', [Validators.required]],
      email     : ['', [Validators.required, Validators.email]],
      date      : ['', [Validators.required]],
      sintomas  : ['', [Validators.required]],
    })
  }

  onSubmit() {

    // Validación para el mensaje de error en caso de que el formulario sea incorrecto
    if(this.pacienteForm.invalid) {

      this.errorFlag = true;
      return;
    }

    // Flag para el error no mas
    this.errorFlag = false;

    // Edita el paciente seleccionado desde la lista
    if(this.selectedItem.id) {

      const updateItem = {...this.selectedItem, ...this.pacienteForm.value}

      this.pacientesService.updatePaciente(updateItem)
        .subscribe( () => {
          // TODO: Snackbar o alguna alerta v:
        })

      //Emite un evento para indicar que la edición fue exitosa
      this.pacientesService.editSuccess.emit(true);

      // Reiniciar la variable la cual guarda el paciente que va a ser editado
      this.selectedItem = {id: '', namePet: '', nameOwner: '', email: '', date: '', sintomas: ''};

    } else {
      // Registro del paciente

      // Se crea y se inserta el id para el objeto paciente
      this.pacienteForm.value.id = this.generarId();

      // Registra el paciente en el service.
      this.pacientesService.addPaciente(this.pacienteForm.value)
        .subscribe( paciente => {

          // TODO: Alguna alerta para cuando se registra v:
        })
    }

    // Reinicia los valores del formulario.
    this.pacienteForm.reset('');
  }

  generarId () : string {

    const random = Math.random().toString(36).substring(2);
    const fecha = Date.now().toString(36);

    return random + fecha;
  }
}
