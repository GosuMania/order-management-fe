import {Injectable} from "@angular/core";
import {HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {TokenService} from ".//token.service";
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from "@angular/router";
import {AuthStateService} from "./auth-state.service"; // Assicurati di aver importato catchError

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService, private router: Router,
              private auth: AuthStateService, public token: TokenService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const accessToken = this.tokenService.getToken();
    req = req.clone({
      setHeaders: {
        Authorization: "Bearer " + accessToken
      }
    });
    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Il token è scaduto, effettua il logout e reindirizza alla pagina di login
          /*
          const user = this.authService.userProfile.getValue() as IUser;
          if (user) {
            const _user: User = {
              name: user.username, email: user.email, password: user.password
            }
            this.authService.signin(_user);
          }
           */
          this.auth.setAuthState(false);
          this.token.removeToken();
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }
}
