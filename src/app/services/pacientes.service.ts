import {EventEmitter, inject, Injectable} from '@angular/core';
import {Paciente} from "../interfaces/paciente.interface";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, of, Subject, tap} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  private baseUrl : string = 'http://localhost:3000/pacientes';
  private deleteItemSubject = new Subject<any>();
  private addItemSubject    = new Subject<any>();

  private http : HttpClient = inject(HttpClient);
  private snackbar : MatSnackBar = inject(MatSnackBar);

  // TODO: Arreglar para no usar any
  private selectedItem  = new BehaviorSubject<Paciente>({
    id: '', namePet: '', nameOwner: '', email: '', date: '', sintomas: ''
  });
  public  selectedItem$     = this.selectedItem.asObservable();

  public editSuccess = new EventEmitter<boolean>();

  setSelectedItem( item : Paciente ) : void {
    this.selectedItem.next(item);
  }

  // Obtiene toda la lista de pacientes
  getPacientes() : Observable<Paciente[]> {

    return this.http.get<Paciente[]>(`${this.baseUrl}`);
  }

  // Se obtiene un paciente por su id
  // getPacienteById( id : string ) : Observable<Paciente> {
  //
  //   return this.http.get<Paciente>(`${this.baseUrl}/${id}`)
  // }

  // Agrega otro paciente a la lista
  addPaciente( paciente : Paciente ) : Observable<Paciente> {
    return this.http.post<Paciente>(`${this.baseUrl}`, paciente)
      .pipe(
        tap( () => this.addItemSubject.next(paciente))
      );
  }

  // Se supone que debe actualizar pacientes v:
  updatePaciente( paciente : Paciente ) : Observable<Paciente> {

    // Hace una validación para el ID
    if(!paciente.id) throw Error('El Id es requerido');

    // Actualiza el paciente, pero solo cambia los campos que fueron modificados.
    return this.http.patch<Paciente>(`${this.baseUrl}/${paciente.id}`, paciente)
      .pipe();
  }

  // Elimina un paciente del array
  deletePaciente( id : string) : Observable<Boolean> {

    return this.http.delete<Paciente>(`${this.baseUrl}/${id}` )
      .pipe(
        catchError( error => of(false) ),
        map( resp => true)
      )
      .pipe(
        tap( () => this.deleteItemSubject.next(id))
      );
  }

  // Utilities

  getDeleteItemObservable() : Observable<Paciente> {
    return this.deleteItemSubject.asObservable();
  }

  getAddItemObservable() : Observable<Paciente> {
    return this.addItemSubject.asObservable();
  }

  // Snackbar
  showSnackBar( message : string ) : void {

    this.snackbar.open( message, 'Cerrar', {

      duration : 5000,
    });
  }
}
