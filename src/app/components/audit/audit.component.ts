import { Component, OnInit } from '@angular/core';
import { AuditLog } from '../../models/audit-log';
import { AuditLogService } from '../../services/audit-log.service';

@Component({
  selector: 'app-audit',
  standalone: false,
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.scss'
})
export class AuditComponent implements OnInit {
  audits: AuditLog[] = [];
  loading: boolean = false;

  constructor(private auditLogService: AuditLogService){}

  async ngOnInit() {
    this.loading = true;
    this.audits = await this.auditLogService.getAll();
    this.loading = false;
  }
}
