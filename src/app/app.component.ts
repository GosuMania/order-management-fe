import {Component, OnInit} from '@angular/core';
import {TokenService} from "./services/token.service";
import {AuthStateService} from "./services/auth-state.service";
import {Router} from "@angular/router";
import {CommonService} from "./services/common.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isSignedIn!: boolean;

  constructor(private auth: AuthStateService, public router: Router, public token: TokenService,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.auth.userAuthState.subscribe((val) => {
      this.isSignedIn = val;
    });
  }

  // Signout
  signOut() {
    this.auth.setAuthState(false);
    this.token.removeToken();
    this.router.navigate(['login']);
  }
}
