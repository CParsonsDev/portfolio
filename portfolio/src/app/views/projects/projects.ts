import { Component, signal, computed, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Portfolio } from "../portfolio/portfolio";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ Portfolio ],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})

export class Projects {
  private sanitizer = inject(DomSanitizer);

  selectedSlug = signal<string>('');

  safeUrl = computed(() => {
    const slug = this.selectedSlug();
    if (!slug) return null;

    const path = `/assets/projects/${slug}/index.html`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(path);
  });
}
