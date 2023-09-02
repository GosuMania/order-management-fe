import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './admin/default/default.component';
import {UserProfileComponent} from "./pages/authentication/user-profile/user-profile.component";
import {SignUpComponent} from "./pages/authentication/sign-up/sign-up.component";
import {SignInComponent} from "./pages/authentication/sign-in/sign-in.component";
import {HomeComponent} from "./pages/home/home.component";
import {CustomersComponent} from "./pages/customers/customers.component";
import {ProductsComponent} from "./pages/products/products.component";
import {OrdersComponent} from "./pages/orders/orders.component";
import {StatisticsComponent} from "./pages/statistics/statistics.component";
import {MerchandiseExchangeComponent} from "./pages/merchandise-exchange/merchandise-exchange.component";
import {CalendarComponent} from "./pages/calendar/calendar.component";
import {ProvidersComponent} from "./pages/providers/providers.component";
import {ColorsComponent} from "./pages/colors/colors.component";

const routes: Routes = [
  {path:'', component: DefaultComponent,
  children : [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: SignInComponent},
    {path: 'register', component: SignUpComponent},
    {path: 'profile', component: UserProfileComponent},
    {path: 'customers', component: CustomersComponent},
    {path: 'providers', component: ProvidersComponent},
    {path: 'products', component: ProductsComponent},
    {path: 'orders', component: OrdersComponent},
    {path: 'statistics', component: StatisticsComponent},
    {path: 'merchandise-exchange', component: MerchandiseExchangeComponent},
    {path: 'calendar', component: CalendarComponent},
    {path: 'colors', component: ColorsComponent},
  ]

}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
