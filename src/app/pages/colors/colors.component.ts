import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {UTILITY} from "../../constants/utility.constant";
import * as moment from 'moment';
import {MatDialog} from "@angular/material/dialog";
import {CommonService} from "../../services/common.service";
import {AuthService} from "../../services/auth.service";
import {IColor, IColorPagination} from "../../interfaces/IColor";
import {ColorService} from "../../services/color.service";
import {
  CreaModificaColorDialogComponent
} from "../../dialogs/crea-modifica-color-dialog/crea-modifica-color-dialog.component";

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent implements AfterViewInit {

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

  displayedColumns: string[] = [
    'colore',
    'actions'
  ];
  dataSource = new MatTableDataSource<IColor>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(public dialog: MatDialog, private colorService: ColorService, public commonService: CommonService,
              private authService: AuthService) {
    this.refreshList();

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
    if(UTILITY.checkText(filterValue)) {
      this.colorService.getColorWithPaginationListSearch(filterValue, this.orderBy, this.ascDesc, this.perPage, this.currentPage + 1)
        .subscribe((data: IColorPagination) => {
          this.total = data.meta.total;
          this.lastPage = data.meta.last_page;
          this.dataSource = new MatTableDataSource<IColor>(data.data);
        });
    } else {
      this.refreshList();
    }

    // this.dataSource.filter = filterValue;
  }

  openDialogAddFornitore(color?: IColor) {
    const dialogRef = this.dialog.open(CreaModificaColorDialogComponent, {
      height: '90%',
      width: '90%',
      data: {color: color},
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
    this.colorService.getColorWithPaginationList(this.orderBy, this.ascDesc, this.perPage, this.currentPage + 1)
      .subscribe((data: IColorPagination) => {
        this.total = data.meta.total;
        this.lastPage = data.meta.last_page;
        this.dataSource = new MatTableDataSource<IColor>(data.data);
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
    if(!UTILITY.checkText(this.ascDesc) || !UTILITY.checkText(this.orderBy)) {
      this.ascDesc = 'ASC';
      this.orderBy = 'id';
    }
    this.refreshList();
  }

  delete(id: number) {
    this.colorService.deleteColor(id).subscribe(res => {
      this.refreshList();
    });
  }
}



