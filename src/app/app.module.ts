import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {DefaultComponent} from './admin/default/default.component';
import {SidebarComponent} from './admin/shard/sidebar/sidebar.component';
import {AuthInterceptor} from "./services/auth.interceptor";
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {SignInComponent} from "./pages/authentication/sign-in/sign-in.component";
import {UserProfileComponent} from "./pages/authentication/user-profile/user-profile.component";
import {SignUpComponent} from "./pages/authentication/sign-up/sign-up.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HomeComponent} from './pages/home/home.component';
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatButtonModule} from "@angular/material/button";
import {CalendarComponent} from './pages/calendar/calendar.component';
import {MatInputModule} from "@angular/material/input";
import {CustomersComponent} from "./pages/customers/customers.component";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MAT_CHIPS_DEFAULT_OPTIONS, MatChipsModule} from "@angular/material/chips";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatDialogModule} from "@angular/material/dialog";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MAT_DATE_LOCALE, MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatSliderModule} from "@angular/material/slider";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatStepperModule} from "@angular/material/stepper";
import {MatTableResponsiveModule} from "./components/mat-table-responsive/mat-table-responsive.module";
import {ProductsComponent} from "./pages/products/products.component";
import {OrdersComponent} from "./pages/orders/orders.component";
import {MomentPipe} from "./pipes/moment.pipe";
import localeIt from '@angular/common/locales/it';
import {registerLocaleData} from "@angular/common";
import {
  CreaModificaClienteDialogComponent
} from './dialogs/crea-modifica-cliente-dialog/crea-modifica-cliente-dialog.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {
  CreaModificaArticoloDialogComponent
} from "./dialogs/crea-modifica-articolo-dialog/crea-modifica-articolo-dialog.component";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import { SpinnerComponent } from './components/spinner/spinner.component';
import {ApiInterceptor} from "./interceptors/api.interceptor";
import {
  CreaModificaOrdineDialogComponent
} from "./dialogs/crea-modifica-ordine-dialog/crea-modifica-ordine-dialog.component";
import {ProductsOrderComponent} from "./components/products-order/products-order.component";
import {ProductsCartComponent} from "./components/products-cart/products-cart.component";
import { VariantsProductOrderComponent } from './components/variants-product-order/variants-product-order.component';
import {
  CreaModificaVariantsDialogComponent
} from "./dialogs/crea-modifica-variants-dialog/crea-modifica-variants-dialog.component";

registerLocaleData(localeIt, 'it');


const Ux_Modules = [
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
]

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    SidebarComponent,
    SignInComponent,
    SignUpComponent,
    UserProfileComponent,
    HomeComponent,
    CalendarComponent,
    CustomersComponent,
    ProductsComponent,
    OrdersComponent,
    MomentPipe,
    CreaModificaClienteDialogComponent,
    CreaModificaArticoloDialogComponent,
    CreaModificaOrdineDialogComponent,
    SpinnerComponent,
    ProductsOrderComponent,
    ProductsCartComponent,
    VariantsProductOrderComponent,
    CreaModificaVariantsDialogComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        Ux_Modules,
        MatTableResponsiveModule,
        FormsModule,
    ],
  exports: [
    MatTableResponsiveModule,
    MomentPipe
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: LOCALE_ID,
      useValue: 'it'
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'it-IT'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [COMMA, ENTER]
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
