import { Component, OnInit } from '@angular/core';
import { UserRole } from '../../models/user-roles';
import { AuthService } from '../../services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-manage-users',
  standalone: false,
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent implements OnInit {
  userRoles: UserRole[] = [];
  loading: boolean = false;

  constructor(private userService: AuthService, private notifications: NzNotificationService) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.userRoles = await this.userService.userRoles();
    this.loading = false;
  }

  //LOGIC
  private update(role: UserRole): void {
    this.userService.updateUserRole(role).subscribe({
      next: (res) => {
        const index = this.userRoles.findIndex(r => r.userRoleId === role.userRoleId);
        if (index !== -1) {
          this.userRoles[index] = res;
        }
        this.notifications.success('Success', `Role ${role.user?.role} approved successfully!`);
      },
      error: (err) => {
      }
    });
  }

  reject(role: UserRole): void {
    role.approved = false;
    this.update(role);
  }

  approve(role: UserRole): void {
    role.approved = true;
    this.update(role);
  }
}
