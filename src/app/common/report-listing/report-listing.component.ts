import { Component, Input } from '@angular/core';
import { ColumnItem } from '../../models/column-item';

@Component({
  selector: 'app-report-listing',
  standalone: false,
  templateUrl: './report-listing.component.html',
  styleUrl: './report-listing.component.scss'
})
export class ReportListingComponent {
  @Input() listOfColumns: ColumnItem[] = [];
  @Input() tableData: any[] = [];
}
