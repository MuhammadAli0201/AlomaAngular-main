import { Component } from '@angular/core';

@Component({
  selector: 'app-intern-welcome',
  standalone: false,
  templateUrl: './intern-welcome.component.html',
  styleUrl: './intern-welcome.component.scss'
})
export class InternWelcomeComponent {
currentDate: Date = new Date();
}
