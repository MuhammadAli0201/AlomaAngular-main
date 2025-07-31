import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-report-header',
  standalone: false,
  templateUrl: './report-header.component.html',
  styleUrl: './report-header.component.scss'
})
export class ReportHeaderComponent {
  currentDate: Date = new Date();
  @Input() userName!: string;
  @Input() reportType!: string;
}
