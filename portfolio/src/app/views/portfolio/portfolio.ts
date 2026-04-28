import { Component, input, output } from '@angular/core';
import { PROJECT_DATA } from '../../model/project-data';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio {
  projects = PROJECT_DATA;
  selectedSlug = input<string>('');

  selectedChange = output<string>();

  select(slug: string) {
    this.selectedChange.emit(slug);
  }
}
