import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-welcome',
  standalone: false,
  templateUrl: './admin-welcome.component.html',
  styleUrl: './admin-welcome.component.scss'
})
export class AdminWelcomeComponent {
 currentDate: Date = new Date();
}
