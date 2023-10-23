import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {IUser} from "../../interfaces/IUser";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {CustomerService} from "../../services/customer.service";
import {CommonService} from "../../services/common.service";
import {AuthService} from "../../services/auth.service";
import {UTILITY} from "../../constants/utility.constant";
import {OrderService} from "../../services/order.service";
import {IOrder, IOrderPagination} from "../../interfaces/IOrder";
import {LABEL} from "../../constants/label.constant";
import {IProvider} from "../../interfaces/IProvider";
import {ProviderService} from "../../services/provider.service";
import {ISimplePickList} from "../../interfaces/ISimplePickList";

@Component({
  selector: 'app-orders-provider',
  templateUrl: './orders-provider.component.html',
  styleUrls: ['./orders-provider.component.scss']
})
export class OrdersProviderComponent implements AfterViewInit {
  label = LABEL;
  perPage = 5;
  lastPage = 0;
  orderBy = 'id';
  ascDesc = 'ASC';
  currentPage = 0;
  total = 0;
  totalAmount = 0;
  totalPieces = 0;
  agenti: IUser[] = [];
  fornitori: IProvider[] = [];
  stagioni: ISimplePickList[] = [];
  orderForm!: FormGroup;


  displayedColumns: string[] = [
    'numeroOrdine',
    'utente',
    'cliente',
    'dataOrdine',
    'consegna',
    'stagione',
    /*
    'totalePezzi',
    'totaleImporto'
     */
  ];
  dataSource = new MatTableDataSource<IOrder>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(public dialog: MatDialog, private customerService: CustomerService, public commonService: CommonService,
              private authService: AuthService, private orderService: OrderService, private cdkRef: ChangeDetectorRef,
              private providerService: ProviderService, private fb: FormBuilder) {
    this.agenti = [];
    this.commonService.utenti.subscribe((usersApi: IUser[]) => {
      if (usersApi.length === 0) {
        this.authService.getUsersList().subscribe(users => {
          this.commonService.utenti.next(users);
        })
      } else {
        this.agenti = usersApi as IUser[];
      }
    });
    this.providerService.providers.subscribe((providers: IProvider[]) => {
      this.fornitori = providers as IProvider[];
    });
    this.commonService.seasonList.subscribe((seasons: ISimplePickList[]) => {
      this.stagioni = seasons as ISimplePickList[];
    });
    this.orderForm = this.fb.group({
      provider: new UntypedFormControl(null, Validators.compose([
        Validators.required,
      ])),
      season: new UntypedFormControl(null, Validators.compose([
        Validators.required
      ]))
    });
  }

  ngAfterViewInit() {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    }
  }

  refreshList() {
    const idProvider = this.orderForm.get('provider')!.value.id;
    const idSeason = this.orderForm.get('season')!.value.id;
    if(idProvider && idSeason) {
      this.orderService.getOrderWithPaginationListSearchProvider(
        null, this.orderBy, this.ascDesc, this.perPage, this.currentPage + 1, idProvider, idSeason)
        .subscribe((data: IOrderPagination) => {
          console.log('Result:', data.meta.total);
          this.total = data.meta.total;
          this.lastPage = data.meta.last_page;
          this.dataSource = new MatTableDataSource<IOrder>(data.data);
        });
      /*
      this.orderService.getTotalPiecesAndAmountsProvider(idProvider, idSeason)
        .subscribe(data => {
          console.log(data);
          this.totalAmount = data.totalAmount;
          this.totalPieces = data.totalPieces;
        });
       */
    }
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

  delete(order: IOrder) {
    this.orderService.getOrderById(order.id!).subscribe(result => {
      order.productList = JSON.parse(JSON.stringify(result.productList));
      this.orderService.deleteOrder(order).subscribe(res => {
        this.refreshList();
      });
    });
  }
}
