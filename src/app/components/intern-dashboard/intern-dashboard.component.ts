import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intern-dashboard',
  templateUrl: './intern-dashboard.component.html',
  styleUrls: ['./intern-dashboard.component.scss'],
  standalone: false

})
export class InternDashboardComponent implements OnInit {
  private user: any;
  isCollapsed: boolean = false;
  router: any;
  constructor(private auth: AuthService, private modalService: NzModalService, router: Router) { }

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe({
      next: (data: any) => {
        this.user = data;
      },
      error: (err: any) => console.error(err)
    });
  }

  logout() {
    this.auth.signOut();
  }

  isProfileModalOpen = false;

  openProfileModal() {
    const modal = this.modalService.create({
      nzContent: ProfileModalComponent,
      nzCloseIcon: '',
      nzFooter: null,
    });

    const instance = modal.componentInstance;
    instance!.user = this.user;
  }
  navigateToDashboard() {
  this.router.navigate(['/intern-dashboard']);
}

}


