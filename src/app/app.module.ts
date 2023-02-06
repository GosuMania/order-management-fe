import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { DefaultComponent } from './admin/default/default.component';
import { SidebarComponent } from './admin/shard/sidebar/sidebar.component';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {AuthInterceptor} from "./shared/auth.interceptor";
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {SignInComponent} from "./pages/sign-in/sign-in.component";
import {UserProfileComponent} from "./pages/user-profile/user-profile.component";
import {SignUpComponent} from "./pages/sign-up/sign-up.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './pages/home/home.component';
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";


const Ux_Modules = [
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatToolbarModule,
  MatCardModule,
  MatInputModule,
  MatCardModule,
  MatBottomSheetModule
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    Ux_Modules
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
