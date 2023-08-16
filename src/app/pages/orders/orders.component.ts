import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {IUser} from "../../interfaces/IUser";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {CustomerService} from "../../services/customer.service";
import {CommonService} from "../../services/common.service";
import {AuthService} from "../../services/auth.service";
import {UTILITY} from "../../constants/utility.constant";
import * as moment from "moment/moment";
import {OrderService} from "../../services/order.service";
import {IOrder, IOrderPagination} from "../../interfaces/IOrder";
import {
  CreaModificaOrdineDialogComponent
} from "../../dialogs/crea-modifica-ordine-dialog/crea-modifica-ordine-dialog.component";
import {LABEL} from "../../constants/label.constant";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements AfterViewInit {
  label = LABEL;
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
  totalAmount = 0;
  totalPieces = 0;
  totalOrders = 0;
  agenti: IUser[] = [];

  displayedColumns: string[] = [
    'numeroOrdine',
    'utente',
    'cliente',
    'dataOrdine',
    'consegna',
    'stagione',
    'totalePezzi',
    'totaleImporto',
    'actions'
  ];
  dataSource = new MatTableDataSource<IOrder>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(public dialog: MatDialog, private customerService: CustomerService, public commonService: CommonService,
              private authService: AuthService, private orderService: OrderService, private cdkRef: ChangeDetectorRef) {
    this.agenti = [];
    this.commonService.utenti.subscribe((usersApi: IUser[]) => {
      if (usersApi.length === 0) {
        this.authService.getUsersList().subscribe(users => {
          this.commonService.utenti.next(users);
        })
      } else {
        this.agenti = usersApi as IUser[];
        this.refreshList();
      }
    });
    // this.dataSource = new MatTableDataSource<ICliente>(ELEMENT_DATA);
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

  applyFilter(value: string) {
    if (value === '') {
      this.cercaValue = '';
    }
    let filterValue = value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (UTILITY.checkText(filterValue)) {
      this.orderService.getOrderWithPaginationListSearch(filterValue, this.orderBy, this.ascDesc, this.perPage, this.currentPage + 1)
        .subscribe((data: IOrderPagination) => {
          this.total = data.meta.total;
          this.lastPage = data.meta.last_page;
          this.dataSource = new MatTableDataSource<IOrder>(data.data);
        });
    } else {
      this.refreshList();
    }
  }

  openDialog(order: IOrder, isCopy?: boolean) {
    if (order) {
      this.orderService.getOrderById(order.id!).subscribe(result => {
        if (isCopy) {
          const copyOrder = JSON.parse(JSON.stringify(order));
          copyOrder.productList = JSON.parse(JSON.stringify(result.productList));
          copyOrder.id = null;
          this.openDialogNewOrder(copyOrder)
        } else {
          order.productList = JSON.parse(JSON.stringify(result.productList));
          this.openDialogNewOrder(order);

        }
      })
    } else {
      this.openDialogNewOrder();
    }
  }

  openDialogNewOrder(order?: IOrder) {
    const dialogRef = this.dialog.open(CreaModificaOrdineDialogComponent, {
      height: '90%',
      width: '90%',
      data: {order: order},
    });

    dialogRef.componentInstance.refreshList.subscribe(() => {
      this.refreshList();
    });

    dialogRef.afterClosed().subscribe(result => {
      dialogRef.componentInstance.refreshList.unsubscribe();
      console.log('The dialog was closed');
    });
  }

  refreshList() {
    this.orderService.getOrderWithPaginationList(this.orderBy, this.ascDesc, this.perPage, this.currentPage + 1)
      .subscribe((data: IOrderPagination) => {
        console.log('Result:', data.meta.total);
        this.total = data.meta.total;
        this.lastPage = data.meta.last_page;
        this.dataSource = new MatTableDataSource<IOrder>(data.data);
      });
    this.orderService.getTotalPiecesAndAmounts()
      .subscribe(data => {
        console.log(data);
        this.totalAmount = data.totalAmount;
        this.totalPieces = data.totalPieces;
      })
  }

  nomeAgente(id: number): string {
    const agente = this.agenti.find(x => x.id === id);
    if (UTILITY.checkObj(agente)) {
      return agente!.username;
    }
    return '';
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
