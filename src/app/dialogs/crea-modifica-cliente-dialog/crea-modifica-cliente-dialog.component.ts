import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ICliente} from "../../interfaces/ICliente";
import {UTILITY} from "../../constants/utility.constant";

@Component({
  selector: 'app-crea-modifica-cliente-dialog',
  templateUrl: './crea-modifica-cliente-dialog.component.html',
  styleUrls: ['./crea-modifica-cliente-dialog.component.scss']
})
export class CreaModificaClienteDialogComponent implements OnInit{
  /*
  id?: number;
  logo?: string;
  ragioneSociale: string;
  piva: string;
  codiceFiscale: string;
  codiceSdi: string;
  pec: string;
  indirizzo: string;
  cap: string;
  localita: string;
  provincia: string;
  paese: string;
  telefono: string;
  email: string;
  destionazioneMerce: string;
  agenteRiferimento: string;

   */

  clienteForm: UntypedFormGroup;

  cliente: ICliente;


  validationSignUp = {
    ragioneSociale: [
      {type: 'required', message: 'Perfavore inserisci un Nome Utente'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri'},
    ],
    piva: [
      {type: 'required', message: 'Perfavore inserisci un Nome Utente'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri'},
    ],
    codiceFiscale: [
      {type: 'required', message: 'Perfavore inserisci un Nome Utente'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri'},
    ],
    codiceSdi: [
      {type: 'required', message: 'Perfavore inserisci un Nome Utente'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri'},
    ],
    pec: [
      {type: 'required', message: 'Perfavore inserisci un Nome Utente'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri'},
    ],
    indirizzo: [
      {type: 'required', message: 'Perfavore inserisci un Nome Utente'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri'},
    ],
    cap: [
      {type: 'required', message: 'Perfavore inserisci un Nome Utente'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri'},
    ],
    localita: [
      {type: 'required', message: 'Perfavore inserisci un Nome Utente'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri'},
    ],
    provincia: [
      {type: 'required', message: 'Perfavore inserisci un Nome Utente'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri'},
    ],
    paese: [
      {type: 'required', message: 'Perfavore inserisci un Nome Utente'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri'},
    ],
    telefono: [
      {type: 'required', message: 'Perfavore inserisci un Nome Utente'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri'},
    ],
    email: [
      {type: 'required', message: 'Perfavore inserisci la tua email!'},
      {type: 'pattern', message: 'Email inserita non valida.'}
    ],
    destionazioneMerce: [
      {type: 'required', message: 'Perfavore inserisci un Nome Utente'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri'},
    ],
    agenteRiferimento: [
      {type: 'required', message: 'Perfavore inserisci un Nome Utente'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri'},
    ],
  };
  constructor(@Inject(MAT_DIALOG_DATA) public data: ICliente, private fb: UntypedFormBuilder) {
    const newCliente: ICliente = {
      ragioneSociale: '',
      piva: '',
      codiceFiscale: '',
      codiceSdi: '',
      pec: '',
      indirizzo: '',
      cap: '',
      localita: '',
      provincia: '',
      paese: '',
      telefono: '',
      email: '',
      destionazioneMerce: '',
      agenteRiferimento: ''
    };
    this.cliente = UTILITY.checkObj(data) ? data : newCliente;

    this.clienteForm = this.fb.group({
      ragioneSociale: [this.cliente.ragioneSociale],
      piva: [this.cliente.piva],
      codiceFiscale: [this.cliente.codiceFiscale],
      codiceSdi: [this.cliente.codiceSdi],
      pec: [this.cliente.pec],
      indirizzo: [this.cliente.indirizzo],
      cap: [this.cliente.cap],
      localita: [this.cliente.localita],
      provincia: [this.cliente.provincia],
      paese: [this.cliente.paese],
      telefono: [this.cliente.telefono],
      email: new UntypedFormControl(this.cliente.email, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      destionazioneMerce: [this.cliente.destionazioneMerce],
      agenteRiferimento: [this.cliente.agenteRiferimento]
    });
  }

  ngOnInit() {

  }


}
