import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {
  FormArray,
  FormControl, FormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {ICustomer} from "../../interfaces/ICustomer";
import {UTILITY} from "../../constants/utility.constant";
import {IUtente} from "../../interfaces/IUtente";
import {PaesiConstant} from "../../constants/paesi.constant";
import {IPaese} from "../../interfaces/IPaese";
import {CustomerService} from "../../services/customer.service";
import {AuthService} from "../../services/auth.service";
import {CommonService} from "../../services/common.service";
import {IColorVariant, IProduct, ISizeVariant} from "../../interfaces/IProduct";
import {ProductService} from "../../services/product.service";
import {IColore} from "../../interfaces/IColore";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {BehaviorSubject, Observable, startWith} from "rxjs";
import {map} from "rxjs/operators";
import {ITaglia} from "../../interfaces/ITaglia";
import {LABEL} from "../../constants/label.constant";
import {ShoeSizeConstant} from "../../constants/size.constant";
import {IProvider} from "../../interfaces/IProvider";
import {IProductType} from "../../interfaces/IProductType";
import {ProviderService} from "../../services/provider.service";

@Component({
  selector: 'app-crea-modifica-articolo-dialog',
  templateUrl: './crea-modifica-articolo-dialog.component.html',
  styleUrls: ['./crea-modifica-articolo-dialog.component.scss']
})
export class CreaModificaArticoloDialogComponent implements OnInit {
  title = 'Nuovo Articolo';
  articoloForm!: FormGroup;
  articolo!: IProduct;
  refreshList = new EventEmitter();

  colori: IColore[] = [];
  coloriSelected: IColore[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  coloriCtrl = new FormControl();
  filterColori: Observable<IColore[]> | undefined;
  @ViewChild('coloreInput') coloreInput: ElementRef<HTMLInputElement> = {} as ElementRef;

  taglie: ITaglia[] = [];
  taglieSelected: ITaglia[] = [];
  taglieCtrl = new FormControl();
  filterTaglie: Observable<ITaglia[]> | undefined;
  @ViewChild('tagliaInput') tagliaInput: ElementRef<HTMLInputElement> = {} as ElementRef;

  fornitori: IProvider[] = [];
  tipologiaProdotti: IProductType[] = [];
  sizeColumns: string[] = [];

  validationCliente = {
    immagine: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'pattern', message: 'Formato inserito non valido.'}
    ],
    fornitore: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
    ],
    codiceArticolo: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
    ],
    descrizioneArticolo: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
    ],
    prezzo: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
    ],
    tipologiaProdotto: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
    ],
    taglia: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
    ],
    colore: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
    ]
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: UntypedFormBuilder, private productService: ProductService,
              private authService: AuthService, private commonService: CommonService, private providerService: ProviderService) {
    this.commonService.colori.subscribe((colors: IColore[]) => {
      this.colori = colors as IColore[];
    });
    this.commonService.taglieAbbigliamento.subscribe((sizes: ITaglia[]) => {
      this.taglie = sizes as ITaglia[];
    });
      this.commonService.fornitori.subscribe((providers: IProvider[]) => {
      this.fornitori = providers as IProvider[];
    });

    this.commonService.tipologiaProdotti.subscribe((productTypes: IProductType[]) => {
      this.tipologiaProdotti = productTypes as IProductType[];
    });


    this.createForm(data);
    this.onChanges();
  }

  ngOnInit() {
  }

  createForm(data: any) {
    const newProduct: IProduct = {
      id: null,
      idType: 0,
      immagine: '',
      idFornitore: 0,
      descFornitore: '',
      codiceArticolo: '',
      descrizioneArticolo: '',
      colorVariants: [],
      prezzo: 0,
    };

    this.articolo = UTILITY.checkObj(data) && UTILITY.checkObj(data.product) && UTILITY.checkText(data.product.id) ? data.product : newProduct;

    this.title = UTILITY.checkText(this.articolo.id) ? 'Modifica Articolo' : 'Nuovo Articolo';

    this.articoloForm = this.fb.group({
      fornitore: new UntypedFormControl(this.articolo.idFornitore, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      codiceArticolo: new UntypedFormControl(this.articolo.codiceArticolo, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{5}')
      ])),
      descrizioneArticolo: new UntypedFormControl(this.articolo.descrizioneArticolo, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      prezzo: new UntypedFormControl(this.articolo.prezzo, Validators.compose([
        Validators.required,
      ])),
      tipologiaProdotto: new UntypedFormControl(this.articolo.idType, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      colorVariants: this.fb.array([])
    });
  }

  onChanges() {
    this.filterColori = this.coloriCtrl.valueChanges.pipe(
      startWith(null),
      map((colore: string | null) => (colore ? this._filterColore(colore) : this._filterColore(null))),
    );

    this.filterTaglie = this.taglieCtrl.valueChanges.pipe(
      startWith(null),
      map((taglia: string | null) => (taglia ? this._filterTaglia(taglia) : this._filterTaglia(null))),
    );

    this.articoloForm.get('tipologiaProdotto')?.valueChanges.subscribe(value => {
      console.log('Value Tipologia Prodotto:', value);
      switch (value) {
        case this.tipologiaProdotti[0].id:
          break;
        case this.tipologiaProdotti[1].id:
          break;
        case this.tipologiaProdotti[2].id:
          break;
        default:
          break;
      }
    });
  }

  /*** SALVATAGGIO ***/
  save() {
    const idColoriSelected: number[] = [];
    this.coloriSelected.forEach(colore => {
      idColoriSelected.push(colore.id)
    });
    const idTaglieSelected: number[] = [];
    this.taglieSelected.forEach(taglia => {
      idTaglieSelected.push(taglia.id)
    });
    this.taglieSelected.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      } else if (a.id < b.id) {
        return -1;
      } else {
        return 0;
      }
    });
    const product: IProduct = {
      id: UTILITY.checkText(this.articolo!.id) ? this.articolo!.id : null,
      idType: 0,
      immagine: this.articoloForm.get('immagine')?.value,
      idFornitore: this.articoloForm.get('fornitore')?.value,
      codiceArticolo: this.articoloForm.get('codiceArticolo')?.value,
      descrizioneArticolo: this.articoloForm.get('descrizioneArticolo')?.value,
      colorVariants: [],
      prezzo: this.articoloForm.get('prezzo')?.value,
    };
    this.productService.createOrUpdateProduct(product).subscribe(res => {
      console.log('Risultato', res);
      this.refreshList.emit();
    })
  }

  /*** COLORE ***/
  get colorVariants(): FormArray {
    return this.articoloForm.controls["colorVariants"] as FormArray;
  }

  getColorVariantsForm(form: any) {
    return form.controls.colorVariants.controls;
  }

  removeColore(id: number) {
    this.coloriSelected = this.coloriSelected.filter(colore => colore.id != id);
    this.colorVariants.controls = this.colorVariants.controls.filter(colorForm => colorForm.get('idColor')?.value != id);
    this.coloriCtrl.setValue(null);
  }

  addColore(event: MatChipInputEvent): void {
    const value = this.colori.find(colore => colore.colore === event.value) || null;

    // Add our fruit
    if (value) {
      this.coloriSelected.push(value);
      this.addColorVariants(this.coloriSelected.length - 1, value)
    }

    // Clear the input value
    event.chipInput!.clear();

    this.coloriCtrl.setValue(null);
  }

  addColorVariants(indexColor: number, colore: IColore, variant?: IColorVariant) {
    if (!variant) {
      let sizeVariantArray: ISizeVariant[] = [];
      if (this.taglieSelected.length > 0) {
        this.taglieSelected.forEach(taglia => {
          const size: ISizeVariant = {
            id: taglia.id,
            descSize: taglia.size,
            stock: 0
          };
          sizeVariantArray.push(size);
        });
      }
      const newVariant: IColorVariant = {
        id: colore.id,
        descColor: colore.colore,
        sizeVariant: sizeVariantArray
      }
      variant = newVariant;
    }
    const variantForm = this.fb.group({
      idColor: [variant.id, Validators.required],
      descColore: [variant.descColor, Validators.required],
      sizeVariants: this.fb.array([]),
    });
    this.colorVariants.push(variantForm);
    if (variant.sizeVariant && variant.sizeVariant?.length > 0) {
      variant.sizeVariant.forEach((sizeVariant, i) => {
        this.addSizeVariants(indexColor, null, sizeVariant);
      })
    }
  }


  selectedColore(event: MatAutocompleteSelectedEvent): void {
    const value = this.colori.find(colore => colore.colore === event.option.value) || null;
    if (value) {
      this.coloriSelected.push(value);
      this.addColorVariants(this.coloriSelected.length - 1, value)
    }
    this.coloreInput.nativeElement.value = '';

    this.coloriCtrl.setValue(null);
  }

  private _filterColore(inputColore: string | null): IColore[] {
    const coloriAviable = this.colori.filter(colore => {
      const check = !UTILITY.checkObj(this.coloriSelected.find(coloreSelected => coloreSelected.colore === colore.colore));
      return check;
    }) as IColore[];
    if (UTILITY.checkText(inputColore)) {
      const valueFilter = inputColore!.toLowerCase();
      return coloriAviable.filter(colore => colore.colore.toLowerCase().includes(valueFilter));
    } else {
      return coloriAviable;
    }
  }

  /*** TAGLIA ***/

  getSizeVariants(index: number): any {
    return this.colorVariants.controls[index].get('sizeVariants') as any;
  }

  getSizeVariantsForm(form: any) {
    return form.controls.sizeVariants.controls;
  }

  removeTaglia(id: number) {
    this.taglieSelected = this.taglieSelected.filter(taglia => taglia.id != id);
    this.colorVariants.controls.forEach((colorForm, index) => {
      // @ts-ignore
      colorForm.get('sizeVariants').controls = colorForm.get('sizeVariants').controls.filter((sizeForm: any) => sizeForm.get('idSize')?.value != id);
    })
    this.taglieCtrl.setValue(null);
  }

  addTaglia(event: MatChipInputEvent): void {
    const value = this.taglie.find(taglia => taglia.size === event.value) || null;
    if (value) {
      this.taglieSelected.push(value);
      this.taglieSelected.sort((a, b) => {
        if (a.id > b.id) {
          return 1;
        } else if (a.id < b.id) {
          return -1;
        } else {
          return 0;
        }
      });
      this.sizeColumns.push(value.size);
      this.coloriSelected.forEach((color, index) => {
        this.addSizeVariants(index, value.id)
      });
    }

    // Clear the input value
    event.chipInput!.clear();

    this.taglieCtrl.setValue(null);
  }

  selectedTaglia(event: MatAutocompleteSelectedEvent): void {
    const value = this.taglie.find(taglia => taglia.size === event.option.value) || null;
    if (value) {
      this.taglieSelected.push(value);
      this.taglieSelected.sort((a, b) => {
        if (a.id > b.id) {
          return 1;
        } else if (a.id < b.id) {
          return -1;
        } else {
          return 0;
        }
      });
      this.coloriSelected.forEach((color, index) => {
        this.addSizeVariants(index, value.id)
      })
    }
    this.tagliaInput.nativeElement.value = '';

    this.taglieCtrl.setValue(null);
  }

  addSizeVariants(indexColor: number, idSize: number | null, sizeVariant?: ISizeVariant) {
    if (!sizeVariant) {
      const newVariant: ISizeVariant = {
        id: idSize,
        stock: 0
      }
      sizeVariant = newVariant;
    }
    const sizeVariantForm = this.fb.group({
      idSize: [sizeVariant.id, Validators.required],
      stock: [sizeVariant.stock, Validators.required]
    });
    this.getSizeVariants(indexColor).push(sizeVariantForm);
  }

  private _filterTaglia(inputTaglia: string | null): ITaglia[] {
    const tagliaAviable = this.taglie.filter(taglia => {
      const check = !UTILITY.checkObj(this.taglieSelected.find(tagliaSelected => tagliaSelected.size === taglia.size));
      return check;
    }) as ITaglia[];
    if (UTILITY.checkText(inputTaglia)) {
      const valueFilter = inputTaglia!.toLowerCase();
      return tagliaAviable.filter(taglia => taglia.size.toLowerCase().includes(valueFilter));
    } else {
      return tagliaAviable;
    }
  }


}
