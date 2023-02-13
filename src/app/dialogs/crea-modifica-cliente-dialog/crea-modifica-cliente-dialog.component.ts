import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ICliente} from "../../interfaces/ICliente";
import {UTILITY} from "../../constants/utility.constant";
import {IUtente} from "../../interfaces/IUtente";
import {PaesiConstant} from "../../constants/paesi.constant";
import {IPaese} from "../../interfaces/IPaese";

@Component({
  selector: 'app-crea-modifica-cliente-dialog',
  templateUrl: './crea-modifica-cliente-dialog.component.html',
  styleUrls: ['./crea-modifica-cliente-dialog.component.scss']
})
export class CreaModificaClienteDialogComponent implements OnInit {
  title = 'Nuovo Cliente';
  clienteForm: UntypedFormGroup;
  cliente: ICliente;
  agenti: IUtente[];
  showDestMerce = false;
  paesi = PaesiConstant.paesi as IPaese[];


  validationCliente = {
    ragioneSociale: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri.'},
    ],
    piva: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'pattern', message: 'Formato inserito non valida.'}
    ],
    codiceFiscale: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'pattern', message: 'Formato inserito non valido.'}
    ],
    codiceSdi: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'minlength', message: 'Deve contenere almeno 7 caratteri.'},
    ],
    pec: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'pattern', message: 'Formato inserito non valido.'}
    ],
    indirizzo: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri.'},
    ],
    cap: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'pattern', message: 'Formato inserito non valido.'}
    ],
    localita: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri.'},
    ],
    provincia: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri.'},
    ],
    paese: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
    ],
    telefono: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'pattern', message: 'Formato inserito non valido.'}
    ],
    email: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'pattern', message: 'Formato inserito non valido.'}
    ],
    agenteRiferimento: [
      {type: 'required', message: 'Campo obbligatorio mancante.'}
    ],
    indirizzoDM: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri.'},
    ],
    capDM: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'pattern', message: 'Formato inserito non valido.'}
    ],
    localitaDM: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri.'},
    ],
    provinciaDM: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri.'},
    ],
    paeseDM: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
    ],
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: UntypedFormBuilder) {
    this.agenti = [];
    const agenteUno: IUtente = {
      id: 1,
      uid: '',
      username: 'Uno',
      email: '',
      agency: {
        name: '',
        id: 1
      },
      typeAccount: '',
    };
    const agenteDue: IUtente = {
      id: 2,
      uid: '',
      username: 'Due',
      email: '',
      agency: {
        name: '',
        id: 1
      },
      typeAccount: '',
    };
    this.agenti.push(agenteUno);
    this.agenti.push(agenteDue);

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
      paese: 'IT',
      telefono: '',
      email: '',
      destinazioneMerce: {
        indirizzo: '',
        cap: '',
        localita: '',
        provincia: '',
        paese: ''
      },
      idAgenteRiferimento: 0
    };
    this.cliente = UTILITY.checkObj(data) && UTILITY.checkObj(data.cliente) && UTILITY.checkText(data.cliente.id) ? data.cliente : newCliente;
    this.title = UTILITY.checkObj(data) && UTILITY.checkObj(data.cliente) && UTILITY.checkText(data.cliente.id) ? 'Modifica Cliente' : 'Nuovo Cliente';

    this.clienteForm = this.fb.group({
      ragioneSociale: new UntypedFormControl(this.cliente.ragioneSociale, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      piva: new UntypedFormControl(this.cliente.piva, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{11}')
      ])),
      codiceFiscale: new UntypedFormControl(this.cliente.codiceFiscale, Validators.compose([
        Validators.required,
        Validators.pattern('([a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z])|([0-9]{11})')
      ])),
      codiceSdi: new UntypedFormControl(this.cliente.codiceSdi, Validators.compose([
        Validators.required,
        Validators.minLength(7)
      ])),
      pec: new UntypedFormControl(this.cliente.pec, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      indirizzo: new UntypedFormControl(this.cliente.indirizzo, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      cap: new UntypedFormControl(this.cliente.cap, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{5}')
      ])),
      localita: new UntypedFormControl(this.cliente.localita, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      provincia: new UntypedFormControl(this.cliente.provincia, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      paese: new UntypedFormControl(this.cliente.paese ? this.cliente.paese : 'IT', Validators.compose([
        Validators.required,
      ])),
      telefono: new UntypedFormControl(this.cliente.telefono, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{10}')
      ])),
      email: new UntypedFormControl(this.cliente.email, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      destinazioneMerce: [UTILITY.checkObj(this.cliente.destinazioneMerce) && UTILITY.checkText(this.cliente.destinazioneMerce.cap)],
      indirizzoDM: new UntypedFormControl(this.cliente.destinazioneMerce.indirizzo,
        Validators.compose([
          Validators.required,
          Validators.minLength(3)
        ])),
      capDM: new UntypedFormControl(this.cliente.destinazioneMerce.cap,
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]{5}')
        ])),
      localitaDM: new UntypedFormControl(this.cliente.destinazioneMerce.localita,
        Validators.compose([
          Validators.required,
          Validators.minLength(3)
        ])),
      provinciaDM: new UntypedFormControl(this.cliente.destinazioneMerce.provincia,
        Validators.compose([
          Validators.required,
          Validators.minLength(3)
        ])),
      paeseDM: new UntypedFormControl(this.cliente.destinazioneMerce.paese ? this.cliente.destinazioneMerce.paese : 'IT',
        Validators.compose([
          Validators.required,
        ])),
      agenteRiferimento: [this.cliente.idAgenteRiferimento]
    });

    this.showDestMerce = UTILITY.checkObj(this.cliente.destinazioneMerce) && UTILITY.checkText(this.cliente.destinazioneMerce.cap);
    this.onChanges();


  }

  ngOnInit() {
  }

  onChanges() {
    this.clienteForm.get('destinazioneMerce')!.valueChanges.subscribe((val: boolean) => {
      console.log('OI: ', val);
      this.showDestMerce = val;
    });
  }


}
