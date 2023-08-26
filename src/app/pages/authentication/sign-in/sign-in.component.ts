import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TokenService } from '../../../services/token.service';
import { AuthStateService } from '../../../services/auth-state.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  loginForm: UntypedFormGroup;
  resetForm: UntypedFormGroup;

  errors:any = null;
  constructor(
    public router: Router,
    public fb: UntypedFormBuilder,
    public authService: AuthService,
    private token: TokenService,
    private authState: AuthStateService
  ) {
    this.loginForm = this.fb.group({
      email: [],
      password: [],
    });
    this.resetForm = this.fb.group({
      emailResetPassword: []
    });
  }
  ngOnInit() {}
  onSubmit() {
    this.authService.signin(this.loginForm.value).subscribe(
      (result) => {
        this.responseHandler(result);
        this.authService.profileUser().subscribe((data: any) => {
          this.authService.userProfile.next(data);
        });
      },
      (error) => {
        this.errors = error.error;
      },
      () => {
        this.authState.setAuthState(true);
        this.loginForm.reset();

        this.router.navigate(['home']);
      }
    );
  }
  // Handle response
  responseHandler(data:any) {
    this.token.handleData(data.access_token);
  }

  resetPassword() {
    this.authService.resetPassword(this.resetForm.get('emailResetPassword')?.value).subscribe(
      (result) => {
        console.log('Result: ', result)
      },
      (error) => {
        console.log('Error: ', error)
      },
      () => {
      }
    );
  }
}
