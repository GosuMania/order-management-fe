import {AfterViewInit, ChangeDetectorRef, Component, Inject, ViewChild} from '@angular/core';
import {
  FormArray,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {CommonService} from "../../services/common.service";
import {UTILITY} from "../../constants/utility.constant";
import * as moment from "moment/moment";
import {IProduct, IProductPagination, ISizeVariant} from "../../interfaces/IProduct";
import {ProductService} from "../../services/product.service";
import {IColor} from "../../interfaces/IColor";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {IProvider} from "../../interfaces/IProvider";
import {IProductType} from "../../interfaces/IProductType";
import {VariantsProductOrderComponent} from "../variants-product-order/variants-product-order.component";
import {ISimplePickList} from "../../interfaces/ISimplePickList";

@Component({
  selector: 'app-products-cart',
  templateUrl: './products-cart.component.html',
  styleUrls: ['./products-cart.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductsCartComponent implements AfterViewInit {
  @ViewChild('variantsProductOrderComponent') variantsProductOrderComponent!: VariantsProductOrderComponent;
  utility = UTILITY;

  campaignOne: UntypedFormGroup;
  startDate: any;
  endDate: any;
  cercaValue: string = '';
  perPage = 5;
  lastPage = 0;
  orderBy = 'id';
  ascDesc = 'ASC';
  currentPage = 0;
  total = 0;
  isSmall = false;

  colori: IColor[] = [];
  taglie: ISimplePickList[] = [];
  fornitori: IProvider[] = [];
  tipologiaProdotti: IProductType[] = [];

  articoloForm!: FormGroup;


  displayedColumns: string[] = [
    'immagine',
    'descProvider',
    'descProductType',
    'codiceArticolo',
    'descrizioneArticolo',
    'prezzo',
    'actions'
  ];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];

  displayedColumnsInExpand: string[] = [
    'colore',
    'tagliaDisponibilita',
    'totale'
  ];

  dataSource = new MatTableDataSource<IProduct>([]);
  expandedElement: IProduct[] | null | undefined;


  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public orderProductList: IProduct[], public dialog: MatDialog,
              private productService: ProductService, private commonService: CommonService,
              private fb: UntypedFormBuilder, private cdkRef: ChangeDetectorRef) {


    this.commonService.isSmall.subscribe(res => {
      this.isSmall = res;
    });

    this.commonService.colori.subscribe((colors: IColor[]) => {
      this.colori = colors as IColor[];
    });
    this.commonService.clothingSizes.subscribe((sizes: ISimplePickList[]) => {
      this.taglie = sizes as ISimplePickList[];
    });
    this.commonService.fornitori.subscribe((providers: IProvider[]) => {
      this.fornitori = providers as IProvider[];
    });

    this.commonService.tipologiaProdotti.subscribe((productTypes: IProductType[]) => {
      this.tipologiaProdotti = productTypes as IProductType[];
    });

    // this.dataSource = new MatTableDataSource<IProduct>(ELEMENT_DATA);
    this.refreshList();

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const day = today.getDate();
    this.campaignOne = new UntypedFormGroup({
      start: new UntypedFormControl(null),
      end: new UntypedFormControl(null),
    });

    if (UTILITY.checkObj(this.campaignOne)) {
      this.campaignOne.get('start')?.valueChanges.subscribe(value => {
        if (UTILITY.checkText(value) && this.startDate !== moment(value).format('YYYY-MM-DD')) {
          this.startDate = moment(value).format('YYYY-MM-DD');
        }
      });

      this.campaignOne.get('end')?.valueChanges.subscribe(value => {
        if (UTILITY.checkText(value) && this.endDate !== moment(value).format('YYYY-MM-DD')) {
          this.endDate = moment(value).format('YYYY-MM-DD');
          if (UTILITY.checkText(this.startDate) && UTILITY.checkText(this.endDate)) {
            console.log('Date:', this.startDate, ' - ', this.endDate)
            // TODO far ripartire la chiamata
          }
        }
      });
    }

  }

  ngAfterViewInit() {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  delete(productInput: IProduct) {
    this.orderProductList.filter(product => product.id !== productInput.id);
    productInput.isAdded = false;
  }

  applyFilter(value: string) {
    if (value === '') {
      this.cercaValue = '';
    }
    let filterValue = value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (UTILITY.checkText(filterValue)) {
      this.productService.getProductWithPaginationListSearch(filterValue, this.orderBy, this.ascDesc, this.perPage, this.currentPage + 1)
        .subscribe((data: IProductPagination) => {
          /*
          if(data.data.length > 0) {
            data.data.forEach(product => product.colore = this.setProductColor(product.idColore));
          }
           */
          this.total = data.meta.total;
          this.lastPage = data.meta.last_page;
          this.dataSource = new MatTableDataSource<IProduct>(data.data);
        });
    } else {
      this.refreshList();
    }
    // this.dataSource.filter = filterValue;
  }

  addProduct(product: IProduct) {
    let newProduct = JSON.parse(JSON.stringify(product)) as IProduct;
    newProduct.colorVariants = this.variantsProductOrderComponent.getColorVariantsToSave(product.idProductType);
    this.orderProductList.push(newProduct);
    product.isAdded = true;
  }

  refreshList() {
    this.productService.getProductWithPaginationList(this.orderBy, this.ascDesc, this.perPage, this.currentPage + 1)
      .subscribe((data: IProductPagination) => {
        /*
        if(data.data.length > 0) {
          data.data.forEach(product => product.colore = this.setProductColor(product.idColore));
        }
         */
        this.total = data.meta.total;
        this.lastPage = data.meta.last_page;
        data.data.forEach(product => {
          this.orderProductList.forEach(orderProduct => {
            if(product.id === orderProduct.id) {
              switch (product.idProductType) {
                case this.tipologiaProdotti[0].id:
                case this.tipologiaProdotti[2].id:
                  orderProduct.colorVariants?.forEach((variant, indexColor) => {
                    variant.sizeVariants?.forEach((sizeVariant, indexSize) => {
                      product!.colorVariants![indexColor].sizeVariants![indexSize].stockOrder = sizeVariant.stockOrder;
                    });
                  });
                  break;
                default:
                  orderProduct.colorVariants?.forEach((variant, index) => {
                    product!.colorVariants![index].stockOrder = variant.stockOrder;
                  })
                  break;
              }
            }
          })
        })
        this.dataSource = new MatTableDataSource<IProduct>(data.data);
      });
  }

  setProductColor(idColore: number): IColor | null {
    const colore = this.colori.find(x => x.id === idColore);
    return colore ? colore : null;
  }


  paginatorChange(event: any) {
    console.log('Event: ', event)
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex;
    this.refreshList();
  }

  sortChange(event: Sort) {
    console.log('Stort: ', event);
    this.ascDesc = event.direction.toUpperCase();
    this.orderBy = UTILITY.camelcaseToSnakeCase(event.active);
    if (!UTILITY.checkText(this.ascDesc) || !UTILITY.checkText(this.orderBy)) {
      this.ascDesc = 'ASC';
      this.orderBy = 'id';
    }
    this.refreshList();
  }

  getTotalStocks(product: IProduct): number {
    let total = 0;
    if (product && product.colorVariants && (product.idProductType == 0 || product.idProductType == 2)) {
      product.colorVariants.forEach(element => {
        element.sizeVariants?.forEach(element2 => {
          total = element2.stock + total;
        });
      });
    } else if (product && product.colorVariants) {
      product.colorVariants.forEach(element => {
        if (element.stock) {
          total = element.stock + total;
        }
      });
    }
    return total;
  }

  getTotalStocksForColor(variants: ISizeVariant[]): number {
    let total = 0;
    variants.forEach(element => {
      total = element.stock + total;
    })
    return total;

  }


  /*** COLORE ***/
  get colorVariants(): FormArray {
    return this.articoloForm.controls["colorVariants"] as FormArray;
  }

  getColorVariantsForm(form: any) {
    return form.controls.colorVariants.controls;
  }

  getSizeVariants(index: number): FormArray {
    return this.colorVariants.controls[index].get('sizeVariants') as FormArray;
  }

  getSizeVariantsForm(form: any) {
    return form.controls.sizeVariants.controls;
  }

  addColors(product: IProduct) {
    product.colorVariants?.forEach(color => {
      let sizeFormArray: FormArray = this.fb.array([]);
      color.sizeVariants!.forEach((sizeVariant, i) => {
        const sizeVariantForm = this.fb.group({
          idSize: [sizeVariant.id, Validators.required],
          stock: [sizeVariant.stock, Validators.required]
        });
        sizeFormArray.push(sizeVariantForm)
      })
      const variantForm = this.fb.group({
        idColor: [color.id, Validators.required],
        descColore: [color.descColor, Validators.required],
        sizeVariants: sizeFormArray as FormArray,
        stockColor: [color.stock]
      });
      this.colorVariants.push(variantForm);
    });
  }

  disableCartButton(element: IProduct): boolean {
    let check = true;
    switch (element.idProductType) {
      case this.tipologiaProdotti[0].id:
      case this.tipologiaProdotti[2].id:
          element.colorVariants?.forEach(variant => {
            if(variant.stockOrder && variant.stockOrder > 0) {
              check = false;
            }
          })
        break;
      default:
        element.colorVariants?.forEach(variant => {
          if (variant.stockOrder && variant.stockOrder > 0) {
            check = false;
          }
        });
        break;
    }
    return check;
  }

  changeValue(event: boolean, element: IProduct) {
    element.disableCartButton = event;
    this.cdkRef.detectChanges();
    console.log('ooooooooooooooooo');
  }
}
