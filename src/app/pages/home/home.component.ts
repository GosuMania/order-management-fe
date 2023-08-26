import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {CommonService} from "../../services/common.service";
import {IUser} from "../../interfaces/IUser";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userProfile: IUser | null = null;

  constructor(private  authService: AuthService, private commonService: CommonService, private cdkRef: ChangeDetectorRef) {
    this.authService.getUsersList().subscribe(utenti => {
      this.commonService.utenti.next(utenti);
    })

    this.authService.userProfile.subscribe((data: IUser | null) => {
      this.userProfile = data;
      setTimeout(() => {
        this.cdkRef.detectChanges();
      }, 100)
    });
  }

  ngOnInit(): void {
  }

}
