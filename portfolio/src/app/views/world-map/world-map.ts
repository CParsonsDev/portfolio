import { OnInit, Component, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CountryData } from '../../model/country-data';
import { WorldbankApi } from '../../services/worldbank-api';

@Component({
  selector: 'app-world-map',
  imports: [CommonModule],
  templateUrl: './world-map.html',
  styleUrl: './world-map.css',
})
export class WorldMap implements OnInit, AfterViewInit{

  countryData: CountryData[]= [];

  constructor(
    private worldbankApi: WorldbankApi,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  // Defaults country report data to show United States information
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.worldbankApi.getCountryData('us').subscribe(
        (data) => {
          this.countryData = data;
          console.log('Country data: ', this.countryData);
          this.cdr.detectChanges();
        }
      );
    }
  }

  // Creates an event listener for each SVG path
  @ViewChild('worldMap', { static: false }) svgRef!: ElementRef;
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('SVG Ref:', this.svgRef);
      if(this.svgRef && this.svgRef.nativeElement) {
        const svgElement = this.svgRef.nativeElement as SVGSVGElement;
        const paths = svgElement.querySelectorAll('path');
        Array.from(paths).forEach((path) => {
          path.addEventListener('mouseover', (event) => this.handleMouseover(event));
          path.addEventListener('mouseout', (event) => this.handleMouseout(event));
        });
      } else {
        console.error('SVG element not found.')
      }
    }
  }
  handleMouseover(event: MouseEvent): void {
    const target = event.target as SVGPathElement;
    console.log(`Mouseover on path with ID: ${target.id}`);

    // Highlights country on mouseover
    target.style.filter = 'brightness(175%)';

    this.worldbankApi.getCountryData(target.id).subscribe(
      (data) => {
        this.countryData = data;
        if(data){
          console.log('Country data: ', this.countryData);
        }
        else{
          console.log('Country data unavailable.')
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching country data:', error);
      }
    );
  }
  handleMouseout(event: MouseEvent): void {
    const target = event.target as SVGPathElement;
    // Clears country highlight on mouseout
    target.style.filter = 'none';
  }
}
