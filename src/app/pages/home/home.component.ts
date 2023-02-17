import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private  authService: AuthService, private commonService: CommonService) {
    this.authService.getUsersList().subscribe(utenti => {
      this.commonService.utenti.next(utenti);
    })
  }

  ngOnInit(): void {
  }

}
