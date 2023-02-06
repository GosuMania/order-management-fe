import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './admin/default/default.component';
import {UserProfileComponent} from "./pages/user-profile/user-profile.component";
import {SignUpComponent} from "./pages/sign-up/sign-up.component";
import {SignInComponent} from "./pages/sign-in/sign-in.component";
import {HomeComponent} from "./pages/home/home.component";

const routes: Routes = [
  {path:'', component: DefaultComponent,
  children : [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: SignInComponent},
    {path: 'register', component: SignUpComponent},
    {path: 'profile', component: UserProfileComponent}
  ]

}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
