import { Component, OnInit } from '@angular/core';
import { User } from 'firebase';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']
})
export class AllComponent implements OnInit {

  users: User[];
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getAllUsers().subscribe(result => {
      this.users = result.users;
    });
  }

}
