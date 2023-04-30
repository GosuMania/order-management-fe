import {Component, ElementRef, EventEmitter, Inject, Input, ViewChild} from '@angular/core';
import {IColorVariant, IProduct, ISizeVariant} from "../../interfaces/IProduct";
import {UTILITY} from "../../constants/utility.constant";
import {FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, Validators} from "@angular/forms";
import {IColor} from "../../interfaces/IColor";
import {IProvider} from "../../interfaces/IProvider";
import {IProductType} from "../../interfaces/IProductType";
import {ProductService} from "../../services/product.service";
import {AuthService} from "../../services/auth.service";
import {CommonService} from "../../services/common.service";
import {ProviderService} from "../../services/provider.service";
import {ISimplePickList} from "../../interfaces/ISimplePickList";

@Component({
  selector: 'app-variants-product-order',
  templateUrl: './variants-product-order.component.html',
  styleUrls: ['./variants-product-order.component.scss']
})
export class VariantsProductOrderComponent {

  product!: IProduct;
  @Input() productStock!: IProduct;


  isSmall = false;

  utility = UTILITY;
  productForm!: FormGroup;
  public refreshList = new EventEmitter();

  colori: IColor[] = [];
  coloriSelected: IColor[] = [];
  coloriCtrl = new FormControl();

  tagliaAbbigliamento: ISimplePickList[] = [];
  tagliaScarpe: ISimplePickList[] = [];
  taglie: ISimplePickList[] = [];
  taglieSelected: ISimplePickList[] = [];
  taglieCtrl = new FormControl();

  fornitori: IProvider[] = [];
  tipologiaProdotti: IProductType[] = [];
  sizeColumns: string[] = [];

  constructor(private fb: UntypedFormBuilder, private productService: ProductService,
              private authService: AuthService, private commonService: CommonService, private providerService: ProviderService) {

    this.commonService.isSmall.subscribe(res => {
      this.isSmall = res;
    });

    this.commonService.colori.subscribe((colors: IColor[]) => {
      this.colori = colors as IColor[];
    });

    this.commonService.clothingSizes.subscribe((sizes: ISimplePickList[]) => {
      this.tagliaAbbigliamento = sizes as ISimplePickList[];
    });

    this.commonService.shoeSizes.subscribe((sizes: ISimplePickList[]) => {
      this.tagliaScarpe = sizes as ISimplePickList[];
    });

    this.commonService.fornitori.subscribe((providers: IProvider[]) => {
      this.fornitori = providers as IProvider[];
    });

    this.commonService.tipologiaProdotti.subscribe((productTypes: IProductType[]) => {
      this.tipologiaProdotti = productTypes as IProductType[];
    });

    setTimeout(() => {
      this.createForm();
      this.onChanges();
    }, 500)

  }

  ngOnInit() {

  }

  createForm() {
    this.product = JSON.parse(JSON.stringify(this.productStock));
    this.product.colorVariants?.forEach(
      colorVariant => {
        colorVariant.stock = colorVariant.stock ? 0 : null;
        colorVariant.sizeVariants?.forEach(
          sizeVariant => {
            sizeVariant.stock = 0;
          }
        )
      }
    )

    this.productForm = this.fb.group({
      colorVariants: this.fb.array([]),
    });

    if (UTILITY.checkText(this.product.id) && this.product.colorVariants && this.product.colorVariants?.length > 0) {
      switch (this.product.idProductType) {
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
      this.product.colorVariants.forEach(colorVariant => {
        if (colorVariant) {
          this.addColorUpdate(colorVariant)
        }
      });
      this.product.colorVariants.forEach((colorVariant, indexColor) => {
        if (colorVariant && colorVariant.sizeVariants) {
          colorVariant.sizeVariants.forEach((sizeVariant, i) => {
            this.addSizeUpdate(indexColor, sizeVariant);
          })
        }
      });
    }
  }

  onChanges() {
  }

  /*** LOAD INFO ***/
  addColorUpdate(colorVariant: IColorVariant): void {
    const value = this.colori.find(colore => colore.id === colorVariant.id) || null;
    colorVariant.descColor = value?.colore;
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

  addSizeUpdate(indexColor: number, sizeVariant: ISizeVariant): void {
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
        this.sizeColumns.push(value.desc);
      }
      this.addSizeVariants(indexColor, sizeVariant)
    }

    this.taglieCtrl.setValue(null);
  }

  /*** COLOR ***/
  get colorVariants(): FormArray {
    return this.productForm.controls["colorVariants"] as FormArray;
  }

  getColorVariantsForm(form: any) {
    return form.controls.colorVariants.controls;
  }

  /*** SIZES ***/

  getSizeVariants(index: number): FormArray {
    return this.colorVariants.controls[index].get('sizeVariants') as FormArray;
  }

  getSizeVariantsForm(form: any) {
    return form.controls.sizeVariants.controls;
  }

  addSizeVariants(indexColor: number, sizeVariant: ISizeVariant) {
    const sizeVariantForm = this.fb.group({
      idSize: [sizeVariant.id, Validators.required],
      stock: [sizeVariant.stock, Validators.required],
      descSize: [sizeVariant.descSize]
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

  /*** GET VALUES TO SAVE ***/
  getColorVariantsToSave(idTipologiaProdotto: number | null): IColorVariant[] {
    let colorVariants: IColorVariant[] = [];
    let stock: number | null = null;
    this.colorVariants.controls.forEach((color: any, indexColor: number) => {
      const sizeVariants: ISizeVariant[] = [];
      if (idTipologiaProdotto === 0 || idTipologiaProdotto === 2) {
        color.controls.sizeVariants.controls.forEach((size: any, indexSize: number) => {
          const sizeVariant: ISizeVariant = {
            id: size.value.idSize,
            stock: size.value.stock,
            descSize: size.value.descSize
          };
          sizeVariants.push(sizeVariant);
        })
      } else {
        stock = color.value.stockColor + 0;
      }

      const colorVariant: IColorVariant = {
        id: color.value.idColor,
        sizeVariants: sizeVariants,
        stock: stock,
        descColor: color.value.descColore
      };
      colorVariants.push(colorVariant);
    });
    return colorVariants;
  }

}
