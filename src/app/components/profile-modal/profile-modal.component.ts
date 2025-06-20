
import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-profile-modal',
  standalone: false,
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.scss'
})
export class ProfileModalComponent {
  @Input() user: any;
  constructor(private authService: AuthService, private modalRef: NzModalRef) { }

  close(): void {
    this.modalRef.close();
  }
}