import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-stats',
  standalone: false,
  templateUrl: './patient-stats.component.html',
  styleUrl: './patient-stats.component.scss'
})
export class PatientStatsComponent implements OnInit {
  count: number = 0;
  trend: 'up' | 'down' | 'stable' = 'stable'; // Add trend tracking

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.patientService.getAllPatients().subscribe(patients => {
      this.count = patients.length;
      this.calculateTrend(patients); // Add trend calculation
    });
  }

  // Add this new method
  private calculateTrend(patients: any[]): void {
    // Simple demo logic - replace with your actual trend calculation
    // This assumes patients have a 'createdAt' date property
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentPatients = patients.filter(p => 
      new Date(p.createdAt) > lastWeek
    );
    
    const olderPatients = patients.filter(p => 
      new Date(p.createdAt) <= lastWeek
    );

    if (recentPatients.length > olderPatients.length) {
      this.trend = 'up';
    } else if (recentPatients.length < olderPatients.length) {
      this.trend = 'down';
    } else {
      this.trend = 'stable';
    }
  }
}