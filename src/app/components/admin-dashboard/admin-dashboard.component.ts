import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: false

})
export class AdminDashboardComponent implements OnInit {
  isCollapsed: boolean = false;
  user:any;
  constructor(private auth: AuthService, private modalService: NzModalService) { }

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe({
      next: (data: any) => {
        this.user = data; 
        console.log(this.user);
      }, 
    });
  }

  logout() {
    this.auth.signOut();
  }

  openProfileModal(): void {
    const modal = this.modalService.create({
      nzContent: ProfileModalComponent,
      nzCloseIcon: '',
      nzFooter: null,
    });

    const instance = modal.componentInstance;
    instance!.user = this.user;
  }
}
