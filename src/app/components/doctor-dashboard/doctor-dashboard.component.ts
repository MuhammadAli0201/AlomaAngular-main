import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss'],
  standalone
    : false
})
export class DoctorDashboardComponent implements OnInit {
  user: any;
  isCollapsed : boolean = false;

  constructor(private auth: AuthService, private modalService: NzModalService) { }

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

  openProfileModal() {
    const modal = this.modalService.create({
      nzContent: ProfileModalComponent,
      nzCloseIcon: '',
      nzFooter: null,
    });

    const instance = modal.componentInstance;
    instance!.user = this.user;
  }

}

