import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../pages/authentication/user-profile/user-profile.component";
import {IUser} from "../../../interfaces/IUser";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  userProfile: IUser | null = null;
  constructor(public authService: AuthService) {
    this.authService.userProfile.subscribe((data: IUser | null) => {
      this.userProfile = data;
    });
  }

  ngOnInit(): void {
  }

}
