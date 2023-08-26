import {Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {UTILITY} from "../../constants/utility.constant";
import {PaesiConstant} from "../../constants/paesi.constant";
import {ICountry} from "../../interfaces/ICountry";
import {IProvider} from "../../interfaces/IProvider";
import {ProviderService} from "../../services/provider.service";

@Component({
  selector: 'app-crea-modifica-fornitore-dialog',
  templateUrl: './crea-modifica-fornitore-dialog.component.html',
  styleUrls: ['./crea-modifica-fornitore-dialog.component.scss']
})
export class CreaModificaFornitoreDialogComponent implements OnInit {
  @ViewChild('scrollContentDialog') private scrollContentDialog: ElementRef = {} as ElementRef;

  title = 'Nuovo Fornitore';
  clienteForm: UntypedFormGroup;
  fornitore: IProvider;
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
    ]
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: UntypedFormBuilder, private providerService: ProviderService,
              public dialogRef: MatDialogRef<CreaModificaFornitoreDialogComponent>) {
    this.dialogRef.disableClose = true;

    const newFornitore: IProvider = {
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
      email: ''
    };
    this.fornitore = UTILITY.checkObj(data) && UTILITY.checkObj(data.fornitore) && UTILITY.checkText(data.fornitore.id) ? data.fornitore : newFornitore;
    this.title = UTILITY.checkText(this.fornitore.id) ? 'Modifica Cliente' : 'Nuovo Cliente';

    this.clienteForm = this.fb.group({
      ragioneSociale: new UntypedFormControl(this.fornitore.ragioneSociale, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      piva: new UntypedFormControl(this.fornitore.piva, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{11}')
      ])),
      codiceFiscale: new UntypedFormControl(this.fornitore.codiceFiscale, Validators.compose([
        Validators.required,
        Validators.pattern('([a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z])|([0-9]{11})')
      ])),
      codiceSdi: new UntypedFormControl(this.fornitore.codiceSdi, Validators.compose([
        Validators.required,
        Validators.minLength(7)
      ])),
      pec: new UntypedFormControl(this.fornitore.pec, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      indirizzo: new UntypedFormControl(this.fornitore.indirizzo, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      cap: new UntypedFormControl(this.fornitore.cap, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{5}')
      ])),
      localita: new UntypedFormControl(this.fornitore.localita, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      provincia: new UntypedFormControl(this.fornitore.provincia, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      paese: new UntypedFormControl(this.fornitore.paese ? this.fornitore.paese : 'Italia', Validators.compose([
        Validators.required,
      ])),
      telefono: new UntypedFormControl(this.fornitore.telefono, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{10}')
      ])),
      email: new UntypedFormControl(this.fornitore.email, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    });
  }

  ngOnInit() {
  }


  save() {
    this.closeAlert();

    const provider: IProvider = {
      id: UTILITY.checkText(this.fornitore!.id) ? this.fornitore!.id : null,
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
    };
    this.providerService.createOrUpdateProvider(provider).subscribe({
      next: (res) => {
        console.log('Risultato', res);
        if (UTILITY.checkText(this.fornitore!.id)) {
          this.alertUpdateOK = true;
        } else {
          this.alertOK = true;
          this.fornitore.id = res.id;
        }
        this.scrollToBottom();
        this.refreshList.emit();
      }, error: (error) => {
        if (UTILITY.checkText(this.fornitore!.id)) {
          this.alertUpdateKO = true;
        } else {
          this.alertKO = true;
        }
        this.scrollToBottom();
        console.log('# error salvataggio: ', error);
      }
    })
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
