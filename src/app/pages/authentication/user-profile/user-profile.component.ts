import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
// User interface
export class User {
  name: any;
  email: any;
}
@Component({
  selector: 'app-authentication-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  userProfile!: User;
  constructor(public authService: AuthService) {
    setTimeout(() => {
      this.authService.profileUser().subscribe((data: any) => {
        this.userProfile = data;
      });
    }, 1000)

  }
  ngOnInit() {}
}
