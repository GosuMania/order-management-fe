import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {SpinnerService} from "../services/spinner.service";
import {Injectable} from "@angular/core";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private spinnerService: SpinnerService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.requestStarted();
    return this.handler(next, request);
  }

  handler(next: any, request: any) {
      return next.handle(request)
        .pipe(
          tap(
            (event) => {
              if(event instanceof HttpResponse) {
                this.spinnerService.requestEnded();
              }
            },
            (error: HttpErrorResponse) => {
              this.spinnerService.resetSpinner();
              throw error;
            }
          )
        )
  }
}
