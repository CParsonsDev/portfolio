import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CountryData } from '../../model/country-data';
import { WorldbankApi } from '../../services/worldbank-api';

@Component({
  selector: 'app-world-map',
  imports: [],
  templateUrl: './world-map.html',
  styleUrl: './world-map.css',
})
export class WorldMap implements OnInit{
  countryData: CountryData[]= [];
  constructor(
    private worldbankApi: WorldbankApi
  ) {}
  // Defaults country report data to show United States information
  ngOnInit(): void {
    this.worldbankApi.getCountryData('us').subscribe(
      (data) => {
        this.countryData = data;
        console.log('Country data: ', this.countryData);
      }
    );
  }

  // Creates an event listener for each SVG path
  @ViewChild('worldMap', { static: false }) svgRef!: ElementRef;
  ngAfterViewInit(): void {
    console.log('SVG Ref:', this.svgRef);
    if(this.svgRef && this.svgRef.nativeElement) {
      const svgElement = this.svgRef.nativeElement as SVGSVGElement;
      const paths = svgElement.querySelectorAll('path');
      paths.forEach((path) => {
        path.addEventListener('mouseover', (event) => this.handleMouseover(event));
        path.addEventListener('mouseout', (event) => this.handleMouseout(event));
      });
    } else {
      console.error('SVG element not found.')
    }
  }
  handleMouseover(event: MouseEvent): void {
    const target = event.target as SVGPathElement;
    console.log(`Mouseover on path with ID: ${target.id}`);
    // Highlights country on mouseover
    target.style.filter = 'brightness(175%)';
        // G.   Generate an API service using HTTPClient to make HTTP calls and include the following methods:
    // •    one method within the component that will trigger the service method when a country is selected and set a local variable that will receive the information about the country for display in the appropriate column of the HTML page
    this.worldbankApi.getCountryData(target.id).subscribe(
      (data) => {
        this.countryData = data;
        if(data){
          console.log('Country data: ', this.countryData);
        }
        else{
          console.log('Country data unavailable.')
        }
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
