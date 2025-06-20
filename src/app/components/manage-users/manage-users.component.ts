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

  constructor(private userService: AuthService, private notifications: NzNotificationService) { }

  async ngOnInit(): Promise<void> {
    this.userRoles = await this.userService.userRoles();
  }

  //LOGIC
  update(role: UserRole): void {
    role.approved = !role.approved;
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
}
