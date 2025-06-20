import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  public users: any[] = [];
  
  constructor(private api : ApiService, private auth: AuthService) {}
  
  ngOnInit(): void {
    this.fetchUsers();
  }
  
  private fetchUsers(): void {
    this.api.getUsers()
      .subscribe({
        next: (response: any) => {
          if (response && Array.isArray(response.data)) {
            this.users = response.data;
          } else {
            this.users = Array.isArray(response) ? response : [];
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching users:', error);
        }
      });
  }
  
  logout(): void {
    this.auth.signOut();
  }
}
