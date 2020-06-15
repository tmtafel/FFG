import { Component, OnInit, Input } from '@angular/core';
import { User } from 'firebase/app';
import { AuthService } from 'src/app/services/auth/auth.service';

export interface UserExtended extends User {
  customClaims;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input() user: UserExtended;
  isAdmin = false;
  loaded = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    try {
      if (this.user.customClaims !== null) {
        if (this.user.customClaims.admin) {
          this.isAdmin = true;
        }
      }
      this.loaded = true;
    } catch (error) {
      console.log(error);
      this.loaded = true;
    }
  }

  addAdmin() {
    this.authService.addAdmin(this.user.email).subscribe(success => {
      if (success) {
        this.isAdmin = true;
      }
    });
  }

  removeAdmin() {
    this.authService.removeAdmin(this.user.email).subscribe(success => {
      if (success) {
        this.isAdmin = false;
      }
    });
  }
}
