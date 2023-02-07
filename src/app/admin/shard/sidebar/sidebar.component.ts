import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../shared/auth.service";
import {User} from "../../../pages/authentication/user-profile/user-profile.component";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  userProfile!: User;
  constructor(public authService: AuthService) {
    this.authService.profileUser().subscribe((data: any) => {
      this.userProfile = data;
    });
  }

  ngOnInit(): void {
  }

}
