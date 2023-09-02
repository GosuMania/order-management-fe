import {AfterViewInit, ChangeDetectorRef, Component, Inject, ViewChild} from '@angular/core';
import {FormArray, FormGroup, UntypedFormBuilder,} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {CommonService} from "../../services/common.service";
import {UTILITY} from "../../constants/utility.constant";
import {IProduct, IProductPagination} from "../../interfaces/IProduct";
import {ProductService} from "../../services/product.service";
import {IColor} from "../../interfaces/IColor";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {IProvider} from "../../interfaces/IProvider";
import {IProductType} from "../../interfaces/IProductType";
import {ISimplePickList} from "../../interfaces/ISimplePickList";
import {
  CreaModificaVariantsDialogComponent
} from "../../dialogs/crea-modifica-variants-dialog/crea-modifica-variants-dialog.component";

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
  utility = UTILITY;
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
  dataSource = new MatTableDataSource<IProduct>([]);


  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  orderProductList!: IProduct[];
  orderProductListBK!: IProduct[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
              private productService: ProductService, private commonService: CommonService,
              private fb: UntypedFormBuilder, private cdkRef: ChangeDetectorRef) {
    this.orderProductList = data.orderProductList;
    this.orderProductListBK = data.orderProductListBK ? data.orderProductListBK : [];

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

    this.refreshList();

  }

  ngAfterViewInit() {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  delete(productInput: IProduct, index: number) {
    this.orderProductList = this.orderProductList.filter(product => product.id !== productInput.id);
    this.refreshList();
    /*
    this.variantsProductOrderComponent.forEach((productOrder) => {
      if (productOrder.product.id === productInput.id) {
        productOrder.product = productInput;
        productOrder.createForm();
      }
    });
     */
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
  }

  addProduct(productInput: IProduct, index: number) {
    const dialogRef = this.dialog.open(CreaModificaVariantsDialogComponent, {
      minHeight: 'calc(100vh - 90px)',
      height: '90%',
      width: '90%',
      data: {product: productInput}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let newProduct = result as IProduct;
        this.orderProductList = this.orderProductList.filter(product => product.id !== productInput.id);
        this.orderProductList.push(newProduct);
        productInput.isAdded = true;
        this.cdkRef.detectChanges();
        console.log('The dialog was closed: ', result);
      }
    });
  }

  refreshList() {
    this.productService.getProductWithPaginationList(this.orderBy, this.ascDesc, this.perPage, this.currentPage + 1)
      .subscribe((data: IProductPagination) => {
        this.total = data.meta.total;
        this.lastPage = data.meta.last_page;
        data.data.forEach(product => {
          this.orderProductList.forEach(orderProduct => {
            if (product.id === orderProduct.id) {
              product.isAdded = true;
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
          });
        });
        if(this.orderProductListBK.length > 0) {
          this.orderProductListBK.forEach(productBk => {
            if(!this.orderProductList.find(product => product.id === productBk.id)) {
              data.data.find(product => {
                if(product.id === productBk.id) {
                  switch (productBk.idProductType) {
                    case this.tipologiaProdotti[0].id:
                    case this.tipologiaProdotti[2].id:
                      productBk.colorVariants?.forEach((variant, indexColor) => {
                        variant.sizeVariants?.forEach((sizeVariant, indexSize) => {
                          product!.colorVariants![indexColor].sizeVariants![indexSize].stock =
                            product!.colorVariants![indexColor].sizeVariants![indexSize].stock + sizeVariant.stockOrder!;
                        });
                      });
                      break;
                    default:
                      productBk.colorVariants?.forEach((variant, index) => {
                        product!.colorVariants![index].stock = product!.colorVariants![index].stock! + variant.stockOrder!;
                      })
                      break;
                  }

                }
              })
            }
          });
        }
        this.dataSource = new MatTableDataSource<IProduct>(data.data);
      });
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

  /*** COLORE ***/
  get colorVariants(): FormArray {
    return this.articoloForm.controls["colorVariants"] as FormArray;
  }


}
