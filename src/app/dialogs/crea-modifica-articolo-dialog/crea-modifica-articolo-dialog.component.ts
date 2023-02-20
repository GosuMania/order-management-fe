import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ICustomer} from "../../interfaces/ICustomer";
import {UTILITY} from "../../constants/utility.constant";
import {IUtente} from "../../interfaces/IUtente";
import {PaesiConstant} from "../../constants/paesi.constant";
import {IPaese} from "../../interfaces/IPaese";
import {CustomerService} from "../../services/customer.service";
import {AuthService} from "../../services/auth.service";
import {CommonService} from "../../services/common.service";
import {IProduct} from "../../interfaces/IProduct";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-crea-modifica-articolo-dialog',
  templateUrl: './crea-modifica-articolo-dialog.component.html',
  styleUrls: ['./crea-modifica-articolo-dialog.component.scss']
})
export class CreaModificaArticoloDialogComponent implements OnInit {
  title = 'Nuovo Articolo';
  articoloForm: UntypedFormGroup;
  articolo: IProduct;
  agenti: IUtente[];
  showDestMerce = false;
  paesi = PaesiConstant.paesi as IPaese[];
  refreshList = new EventEmitter();


  validationCliente = {
    immagine: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'pattern', message: 'Formato inserito non valido.'}
    ],
    fornitore: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri.'},
    ],
    codiceArticolo: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'pattern', message: 'Formato inserito non valida.'}
    ],
    descrizioneArticolo: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'pattern', message: 'Formato inserito non valido.'}
    ],
    taglia: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'minlength', message: 'Deve contenere almeno 7 caratteri.'},
    ],
    colore: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'pattern', message: 'Formato inserito non valido.'}
    ],
    prezzo: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'minlength', message: 'Deve contenere almeno 3 caratteri.'},
    ],
    quantitaMagazzino: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'pattern', message: 'Formato inserito non valido.'}
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
    ]
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: UntypedFormBuilder, private productService: ProductService,
              private authService: AuthService, private commonService: CommonService) {
    this.agenti = [];
    this.commonService.utenti.subscribe((utenti: IUtente[]) => {
      if (utenti.length === 0) {
        this.authService.getUsersList().subscribe(users => {
          this.commonService.utenti.next(users);
        })
      } else {
        this.agenti = utenti as IUtente[];
      }
    });

    const newProduct: IProduct = {
      id: null,
      immagine: '',
      fornitore: '',
      codiceArticolo: '',
      descrizioneArticolo: '',
      taglia: '',
      idColore: 0,
      prezzo: 0,
      quantitaMagazzino: 0,
    };
    this.articolo = UTILITY.checkObj(data) && UTILITY.checkObj(data.product) && UTILITY.checkText(data.product.id) ? data.product : newProduct;
    this.title = UTILITY.checkText(this.articolo.id) ? 'Modifica Articolo' : 'Nuovo Articolo';

    this.articoloForm = this.fb.group({
      fornitore: new UntypedFormControl(this.articolo.fornitore, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      codiceArticolo: new UntypedFormControl(this.articolo.codiceArticolo, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{11}')
      ])),
      descrizioneArticolo: new UntypedFormControl(this.articolo.descrizioneArticolo, Validators.compose([
        Validators.required,
        Validators.pattern('([a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z])|([0-9]{11})')
      ])),
      taglia: new UntypedFormControl(this.articolo.taglia, Validators.compose([
        Validators.required,
        Validators.minLength(7)
      ])),
      colore: new UntypedFormControl(this.articolo.colore, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      prezzo: new UntypedFormControl(this.articolo.prezzo, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      quantitaMagazzino: new UntypedFormControl(this.articolo.quantitaMagazzino, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{5}')
      ]))
    });
    this.onChanges();
  }

  ngOnInit() {
  }

  onChanges() {
  }

  save() {
    const product: IProduct = {
      id: UTILITY.checkText(this.articolo!.id) ? this.articolo!.id : null,
      immagine: this.articoloForm.get('immagine')?.value,
      fornitore: this.articoloForm.get('fornitore')?.value,
      codiceArticolo: this.articoloForm.get('codiceArticolo')?.value,
      descrizioneArticolo: this.articoloForm.get('descrizioneArticolo')?.value,
      taglia: this.articoloForm.get('taglia')?.value,
      idColore: this.articoloForm.get('colore')?.value,
      prezzo: this.articoloForm.get('prezzo')?.value,
      quantitaMagazzino: this.articoloForm.get('quantitaMagazzino')?.value,
      quantitaDisponibile: this.articoloForm.get('quantitaMagazzino')?.value
    };
    this.productService.createOrUpdateProduct(product).subscribe(res => {
      console.log('Risultato', res);
      this.refreshList.emit();
    })
  }

}
