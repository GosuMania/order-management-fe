import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {
  FormArray,
  FormControl, FormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators
} from "@angular/forms";
import {UTILITY} from "../../constants/utility.constant";
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

class ImageSnippet {
  pending = false;
  status = 'init';

  constructor(public src?: string, public file?: File) {
  }
}

@Component({
  selector: 'app-crea-modifica-articolo-dialog',
  templateUrl: './crea-modifica-articolo-dialog.component.html',
  styleUrls: ['./crea-modifica-articolo-dialog.component.scss']
})
export class CreaModificaArticoloDialogComponent implements OnInit {
  @ViewChild('imageInput') imageInput: ElementRef<HTMLInputElement> = {} as ElementRef;

  utility = UTILITY;
  title = 'Nuovo Articolo';
  articoloForm!: FormGroup;
  articolo!: IProduct;
  public refreshList = new EventEmitter();

  colori: IColore[] = [];
  coloriSelected: IColore[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  coloriCtrl = new FormControl();
  filterColori: Observable<IColore[]> | undefined;
  @ViewChild('coloreInput') coloreInput: ElementRef<HTMLInputElement> = {} as ElementRef;

  tagliaAbbigliamento: ITaglia[] = [];
  tagliaScarpe: ITaglia[] = [];
  taglie: ITaglia[] = [];
  taglieSelected: ITaglia[] = [];
  taglieCtrl = new FormControl();
  filterTaglie: Observable<ITaglia[]> | undefined;
  @ViewChild('tagliaInput') tagliaInput: ElementRef<HTMLInputElement> = {} as ElementRef;

  fornitori: IProvider[] = [];
  tipologiaProdotti: IProductType[] = [];
  sizeColumns: string[] = [];

  selectedFileOnChange: any;

  selectedFile: ImageSnippet = new ImageSnippet();

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
  alertChangeFormatPrice = false;
  isSmall = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: UntypedFormBuilder, private productService: ProductService,
              private authService: AuthService, private commonService: CommonService, private providerService: ProviderService) {

    this.commonService.isSmall.subscribe(res => {
      this.isSmall = res;
    });
    this.commonService.colori.subscribe((colors: IColore[]) => {
      this.colori = colors as IColore[];
    });

    this.commonService.taglieAbbigliamento.subscribe((sizes: ITaglia[]) => {
      this.tagliaAbbigliamento = sizes as ITaglia[];
    });

    this.commonService.tagliaScarpe.subscribe((sizes: ITaglia[]) => {
      this.tagliaScarpe = sizes as ITaglia[];
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
      idProductType: null,
      image: null,
      idProvider: null,
      descProvider: '',
      productCode: '',
      productDesc: '',
      colorVariants: [],
      price: null,
    };

    let provider = null;
    let productType = null;
    if (UTILITY.checkObj(data) && UTILITY.checkObj(data.product) && UTILITY.checkText(data.product.id)) {
      this.articolo = data.product;
      this.title = 'Modifica Articolo';
      provider = this.fornitori.find(fornitore => fornitore.id === this.articolo.idProvider);
      productType = this.tipologiaProdotti.find(tipologiaProdotto => tipologiaProdotto.id === this.articolo.idProductType);
    } else {
      this.articolo = newProduct;
    }
    this.articoloForm = this.fb.group({
      fornitore: new UntypedFormControl(provider, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      codiceArticolo: new UntypedFormControl(this.articolo.productCode, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      descrizioneArticolo: new UntypedFormControl(this.articolo.productDesc, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      prezzo: new UntypedFormControl(this.articolo.price, Validators.compose([
        Validators.required,
      ])),
      tipologiaProdotto: new UntypedFormControl(productType, Validators.compose([
        Validators.required,
      ])),
      colorVariants: this.fb.array([]),
    });

    if (UTILITY.checkText(this.articolo.id) && this.articolo.colorVariants && this.articolo.colorVariants?.length > 0) {
      switch (this.articolo.idProductType) {
        case this.tipologiaProdotti[0].id:
          this.taglie = this.tagliaAbbigliamento;
          break;
        case this.tipologiaProdotti[2].id:
          this.taglie = this.tagliaScarpe;
          break;
        default:
          this.taglie = [];
          break;
      }
      this.articolo.colorVariants.forEach(colorVariant => {
        if (colorVariant) {
          this.addColoreUpdate(colorVariant)
        }
      });
      this.articolo.colorVariants.forEach((colorVariant, indexColor) => {
        if (colorVariant && colorVariant.sizeVariants) {
          colorVariant.sizeVariants.forEach((sizeVariant, i) => {
            this.addTagliaUpdate(indexColor, sizeVariant);
          })
        }
      });
    }
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

    this.articoloForm.get('prezzo')?.valueChanges.subscribe(value => {
      // this.alertChangeFormatPrice = false;
    });

    this.articoloForm.get('tipologiaProdotto')?.valueChanges.subscribe(value => {
      console.log('Value Tipologia Prodotto:', value);
      this.coloriSelected = [];
      this.taglieSelected = [];
      this.colorVariants.controls = [];
      switch (value.id) {
        case this.tipologiaProdotti[0].id:
          this.taglie = this.tagliaAbbigliamento;
          break;
        case this.tipologiaProdotti[2].id:
          this.taglie = this.tagliaScarpe;
          break;
        default:
          this.taglie = [];
          break;
      }
    });
  }

  /*** UPDATE ***/
  addColoreUpdate(colorVariant: IColorVariant): void {
    const value = this.colori.find(colore => colore.id === colorVariant.id) || null;
    colorVariant.descColor = value?.colore;
    // Add our fruit
    if (value) {
      this.coloriSelected.push(value);
      this.addColorVariantsUpdate(this.coloriSelected.length - 1, colorVariant)
    }
    this.coloriCtrl.setValue(null);
  }

  addColorVariantsUpdate(indexColor: number, colorVariant: IColorVariant) {
    const variantForm = this.fb.group({
      idColor: [colorVariant.id, Validators.required],
      descColore: [colorVariant.descColor, Validators.required],
      sizeVariants: this.fb.array([]),
      stockColor: [colorVariant.stock]
    });
    this.colorVariants.push(variantForm);
  }

  addTagliaUpdate(indexColor: number, sizeVariant: ISizeVariant): void {
    const value = this.taglie.find(taglia => taglia.id === sizeVariant.id) || null;
    if (value) {
      const valueFind = this.taglieSelected.find(taglia => taglia.id === sizeVariant.id) || null;
      if (!valueFind) {
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
      }
      this.addSizeVariants(indexColor, null, sizeVariant)
    }

    this.taglieCtrl.setValue(null);
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
        sizeVariants: sizeVariantArray,
        stock: null
      }
      variant = newVariant;
    }
    const variantForm = this.fb.group({
      idColor: [variant.id, Validators.required],
      descColore: [variant.descColor, Validators.required],
      sizeVariants: this.fb.array([]),
      stockColor: [variant.stock]
    });
    this.colorVariants.push(variantForm);
    if (variant.sizeVariants && variant.sizeVariants?.length > 0) {
      variant.sizeVariants.forEach((sizeVariant, i) => {
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

  getSizeVariants(index: number): FormArray {
    return this.colorVariants.controls[index].get('sizeVariants') as FormArray;
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

    this.getSizeVariants(indexColor).controls.sort((a, b) => {
      const first = a.get('idSize')?.value;
      const second = b.get('idSize')?.value;
      if (first > second) {
        return 1;
      } else if (first < second) {
        return -1;
      } else {
        return 0;
      }
    });
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

  /*** Image Upload ***/
  processFile(imageInput: any) {
    const file: File = imageInput.nativeElement.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        this.selectedFile = new ImageSnippet(event.target.result, file);
        this.selectedFile.pending = true;
        if (this.selectedFile != null) {
          this.commonService.uploadImage(this.selectedFile.file).subscribe(
            (imageLink: string) => {
              console.log(imageLink);
              this.articolo.image = imageLink;
              this.selectedFile.pending = false;
              this.save();
            },
            () => {
              this.onError();
            });
        }

      });
      reader.readAsDataURL(file);
    } else {
      this.save();
    }

  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }

  /*** SALVATAGGIO ***/
  save() {
    const colorVariants = this.getColorVariantsToSave(this.articoloForm.get('tipologiaProdotto')?.value.id);
    const product: IProduct = {
      id: UTILITY.checkText(this.articolo!.id) ? this.articolo!.id : null,
      image: this.articolo.image,
      idProductType: this.articoloForm.get('tipologiaProdotto')?.value.id,
      descProductType: this.articoloForm.get('tipologiaProdotto')?.value.type,
      idProvider: this.articoloForm.get('fornitore')?.value.id,
      descProvider: this.articoloForm.get('fornitore')?.value.ragioneSociale,
      productCode: this.articoloForm.get('codiceArticolo')?.value,
      productDesc: this.articoloForm.get('descrizioneArticolo')?.value,
      colorVariants: colorVariants,
      price: this.articoloForm.get('prezzo')?.value,
    };
    this.productService.createOrUpdateProduct(product).subscribe(res => {
      console.log('Risultato', res);
      this.refreshList.emit();
    })
  }

  getColorVariantsToSave(idTipologiaProdotto: number): IColorVariant[] {
    let colorVariants: IColorVariant[] = [];
    let stock: number | null = null;
    this.colorVariants.controls.forEach((color, indexColor) => {
      const sizeVariants: ISizeVariant[] = [];
      if (idTipologiaProdotto === 0 || idTipologiaProdotto === 2) {
        this.taglieSelected.forEach((size, index) => {
          const sizeVariant: ISizeVariant = {
            id: this.getSizeVariants(indexColor).at(index).value.idSize,
            stock: this.getSizeVariants(indexColor).at(index).value.stock
          };
          sizeVariants.push(sizeVariant);
        });
      } else {
        stock = color.value.stockColor + 0;
      }

      const colorVariant: IColorVariant = {
        id: color.value.idColor,
        sizeVariants: sizeVariants,
        stock: stock
      };
      colorVariants.push(colorVariant);
    });
    return colorVariants;
  }


  selectFileFromButton() {
    this.imageInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    if (event.target.files[0]) {
      this.selectedFileOnChange = event.target.files[0]
      this.articolo.image = null;
    } else {
      this.selectedFileOnChange = null;
    }
  }

  clearImage() {
    this.articolo.image = null;
  }

  onBlurPrice() {
    const valueInput = this.articoloForm.get('prezzo')?.value;
    const value = valueInput.toFixed(2)
    this.articoloForm.get('prezzo')?.setValue(value);
    if (value + '' != valueInput + '') {
      this.alertChangeFormatPrice = true;
    }
  }

  onFocusPrice() {
    this.alertChangeFormatPrice = false;
  }
}