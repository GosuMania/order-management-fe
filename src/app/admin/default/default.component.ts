import {AfterContentInit, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout'
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from "@angular/router";
import {TokenService} from "../../services/token.service";
import {AuthStateService} from "../../services/auth-state.service";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements AfterContentInit, OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isSignedIn!: boolean;


  constructor(private breakpointObserver: BreakpointObserver, private auth: AuthStateService, public router: Router,
              public token: TokenService) {
  }

  ngOnInit() {
    this.auth.userAuthState.subscribe((val) => {
      this.isSignedIn = val;
      setTimeout(() => {
        this.breakpointObserver.observe(['(max-width: 800px)']).subscribe((res) => {
          console.log(res.matches);
          if(this.sidenav) {
            if (res.matches) {
              this.sidenav.mode = 'over';
              this.sidenav.close()
            } else {
              this.sidenav.mode = 'side';
              this.sidenav.open()
            }
          }

        })
      }, 500);
    });
  }

  ngAfterContentInit (): void {
  }

  // Signout
  signOut() {
    this.auth.setAuthState(false);
    this.token.removeToken();
    this.router.navigate(['login']);
  }

}
