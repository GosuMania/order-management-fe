import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {LABEL} from "../../constants/label.constant";
import {IUser} from "../../interfaces/IUser";
import {IProvider} from "../../interfaces/IProvider";
import {ISimplePickList} from "../../interfaces/ISimplePickList";
import {FormBuilder, FormGroup, UntypedFormControl, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {IOrder} from "../../interfaces/IOrder";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {CustomerService} from "../../services/customer.service";
import {CommonService} from "../../services/common.service";
import {AuthService} from "../../services/auth.service";
import {OrderService} from "../../services/order.service";
import {ProviderService} from "../../services/provider.service";
import {UTILITY} from "../../constants/utility.constant";
import {IProduct} from "../../interfaces/IProduct";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements AfterViewInit {
  label = LABEL;
  perPage = 5;
  lastPage = 0;
  orderBy = 'total_quantity';
  ascDesc = 'DESC';
  currentPage = 0;
  total = 0;
  // totalAmount = 0;
  // totalPieces = 0;
  agenti: IUser[] = [];
  fornitori: IProvider[] = [];
  stagioni: ISimplePickList[] = [];
  statsForm!: FormGroup;
  isSmall = false;


  displayedColumns: string[] = [
    'immagine',
    'descSeasonType',
    'descProvider',
    'descProductType',
    'codiceArticolo',
    'descrizioneArticolo',
    'prezzo',
    'totalQuantity'
  ];
  dataSource = new MatTableDataSource<IProduct>([]);

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
    this.statsForm = this.fb.group({
      provider: new UntypedFormControl(null, Validators.compose([])),
      season: new UntypedFormControl(null, Validators.compose([]))
    });
  }

  ngAfterViewInit() {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  refreshList() {
    const idSeason = this.statsForm.get('season')!.value ? this.statsForm.get('season')!.value.id : null;
    const idProvider = this.statsForm.get('provider')!.value ? this.statsForm.get('provider')!.value.id : null;
    this.orderService.getOrderProductStatsWithPaginationListSearch(this.ascDesc, this.perPage, this.currentPage + 1, idProvider, idSeason).subscribe((data: any) => {
      this.total = data.meta.total;
      this.lastPage = data.meta.last_page;
      this.dataSource = new MatTableDataSource<IProduct>(data.data);
    });

    /*
    if(idProvider && idSeason) {
      this.orderService.getOrderWithPaginationListSearchProvider(
        null, this.orderBy, this.ascDesc, this.perPage, this.currentPage + 1, idProvider, idSeason)
        .subscribe((data: IOrderPagination) => {
          console.log('Result:', data.meta.total);
          this.total = data.meta.total;
          this.lastPage = data.meta.last_page;
          this.dataSource = new MatTableDataSource<IOrder>(data.data);
        });
    }

     */
  }

  paginatorChange(event: any) {
    console.log('Event: ', event)
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex;
    this.refreshList();
  }

  sortChange(event: Sort) {
    this.ascDesc = event.direction.toUpperCase();
    this.orderBy = UTILITY.camelcaseToSnakeCase(event.active);
    if (!UTILITY.checkText(this.ascDesc) || !UTILITY.checkText(this.orderBy)) {
      this.ascDesc = 'DESC';
      this.orderBy = 'total_quantity';
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
