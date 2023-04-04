import {Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ICustomer} from "../../interfaces/ICustomer";
import {UTILITY} from "../../constants/utility.constant";
import {IUser} from "../../interfaces/IUser";
import {PaesiConstant} from "../../constants/paesi.constant";
import {ICountry} from "../../interfaces/ICountry";
import {CustomerService} from "../../services/customer.service";
import {AuthService} from "../../services/auth.service";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-crea-modifica-cliente-dialog',
  templateUrl: './crea-modifica-cliente-dialog.component.html',
  styleUrls: ['./crea-modifica-cliente-dialog.component.scss']
})
export class CreaModificaClienteDialogComponent implements OnInit {
  @ViewChild('scrollContentDialog') private scrollContentDialog: ElementRef = {} as ElementRef;

  title = 'Nuovo Cliente';
  clienteForm: UntypedFormGroup;
  cliente: ICustomer;
  agenti: IUser[];
  showDestMerce = false;
  paesi = PaesiConstant.paesi as ICountry[];
  refreshList = new EventEmitter();

  alertOK = false;
  alertKO = false;
  alertUpdateOK = false;
  alertUpdateKO = false;

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: UntypedFormBuilder, private customerService: CustomerService,
              private authService: AuthService, private commonService: CommonService) {
    this.agenti = [];
    this.commonService.utenti.subscribe((utenti: IUser[]) => {
      if (utenti.length === 0) {
        this.authService.getUsersList().subscribe(users => {
          this.commonService.utenti.next(users);
        })
      } else {
        this.agenti = utenti as IUser[];
      }
    });

    const newCliente: ICustomer = {
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
      idAgenteRiferimento: null,
      usernameAgenteRiferimento: null
    };
    this.cliente = UTILITY.checkObj(data) && UTILITY.checkObj(data.cliente) && UTILITY.checkText(data.cliente.id) ? data.cliente : newCliente;
    this.title = UTILITY.checkText(this.cliente.id) ? 'Modifica Cliente' : 'Nuovo Cliente';

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

  save() {
    this.closeAlert();

    const customer: ICustomer = {
      id: UTILITY.checkText(this.cliente!.id) ? this.cliente!.id : null,
      ragioneSociale: this.clienteForm.get('ragioneSociale')?.value,
      piva: this.clienteForm.get('piva')?.value,
      codiceFiscale: this.clienteForm.get('codiceFiscale')?.value,
      codiceSdi: this.clienteForm.get('codiceSdi')?.value,
      pec: this.clienteForm.get('pec')?.value,
      indirizzo: this.clienteForm.get('indirizzo')?.value,
      cap: this.clienteForm.get('cap')?.value,
      localita: this.clienteForm.get('localita')?.value,
      provincia: this.clienteForm.get('provincia')?.value,
      paese: this.clienteForm.get('paese')?.value,
      telefono: this.clienteForm.get('telefono')?.value,
      email: this.clienteForm.get('email')?.value,
      destinazioneMerce: {
        indirizzo: this.clienteForm.get('destinazioneMerce')?.value ? this.clienteForm.get('indirizzoDM')?.value : null,
        cap: this.clienteForm.get('destinazioneMerce')?.value ? this.clienteForm.get('capDM')?.value : null,
        localita: this.clienteForm.get('destinazioneMerce')?.value ? this.clienteForm.get('localitaDM')?.value : null,
        provincia: this.clienteForm.get('destinazioneMerce')?.value ? this.clienteForm.get('provinciaDM')?.value : null,
        paese: this.clienteForm.get('destinazioneMerce')?.value ? this.clienteForm.get('paeseDM')?.value : null,
      },
      idAgenteRiferimento: this.clienteForm.get('agenteRiferimento')?.value,
      usernameAgenteRiferimento: this.nomeAgente(this.clienteForm.get('agenteRiferimento')?.value)
    };
    this.customerService.createOrUpdateCustomer(customer).subscribe({
      next: (res) => {
        console.log('Risultato', res);
        if (UTILITY.checkText(this.cliente!.id)) {
          this.alertUpdateOK = true;
        } else {
          this.alertOK = true;
          this.cliente.id = res.id;
        }
        this.scrollToBottom();
        this.refreshList.emit();
      }, error: (error) => {
        if (UTILITY.checkText(this.cliente!.id)) {
          this.alertUpdateKO = true;
        } else {
          this.alertKO = true;
        }
        this.scrollToBottom();
        console.log('# error salvataggio: ', error);
      }
    })
  }

  nomeAgente(id: number): string {
    const agente = this.agenti.find(x => x.id === id);
    if (UTILITY.checkObj(agente)) {
      return agente!.username;
    }
    return '';
  }

  /*** ALERT ***/
  closeAlert() {
    this.alertOK = false;
    this.alertKO = false;
    this.alertUpdateOK = false;
    this.alertUpdateKO = false;
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.scrollContentDialog.nativeElement.scrollTop = this.scrollContentDialog.nativeElement.scrollHeight;

      }, 100)
    } catch (err) {
      console.log(err);
    }
  }

}
