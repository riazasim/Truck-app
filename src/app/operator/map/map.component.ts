import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { BehaviorSubject } from 'rxjs';
import { MapSerachService } from 'src/app/core/services/map-search.service';

declare var google: any;
@Component({
    selector: 'app-map',
    templateUrl: 'map.component.html',
    styleUrl:'./map.component.scss'
  })
    export class MapComponent implements OnInit {
      @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
    markerPositions: google.maps.LatLngLiteral[] = [];
    display: any;
    searchQuery: string = '';
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    dataSource: any[] = [];
  
    center: google.maps.LatLngLiteral = {
      lat: 44.138896,
      lng: 28.821234,
    };
    zoom = 12;
    imageUrl = 'https://angular.io/assets/images/logos/angular/angular.svg';
    searchCard: google.maps.LatLngBoundsLiteral = {
      east: 10,
      north: 10,
      south: -10,
      west: -10,
    };
    
  
    constructor(
      private readonly mapSearchService: MapSerachService,
      private readonly cd: ChangeDetectorRef
    ) {}


    ngOnInit(): void {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 44.138896, lng: 28.821234 },
        zoom: 12,
        // mapId:,
      });
  
      // Call the function to retrieve map data
      this.retrieveMapData(map);
    }
  
    retrieveMapData(map: any): void {
      this.isLoading$.next(true);
      let data = {
        "start": 0,
        "length": 0,
        "filters": ["", "", "", "", "", "", "", ""],
        "order": [{ "dir": "DESC", "column": 0 }]
      };
      this.mapSearchService.getMicroPlanningConvoyes(data).subscribe({
        next: response => {
          this.dataSource = response.items;
          console.log('map',this.dataSource)
          this.markerPositions = []
          this.dataSource.forEach(item => {
            if (item && item.sidCoordinates) {
              const coordinates = item.sidCoordinates.split(',');
              const markerPosition = {
                lat: parseFloat(coordinates[0]),
                lng: parseFloat(coordinates[1])
              };
              this.markerPositions.push(markerPosition);
            }
          });
  
          this.markerPositions.forEach(position => {
            
           new google.maps.Marker({
            position: position,
              map,
              title: 'Marker Title'
            });
          });
  
          this.cd.detectChanges();
          this.isLoading$.next(false);
        }
      });
    }
        
        // const overlayDiv = document.getElementById('overlay');
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(overlayDiv);
    // }

    // addMarker(event: google.maps.MapMouseEvent) {
    //     this.markerPositions = [];
    //     console.log(this.markerPositions);

    //     if (event.latLng != null)
    //         this.markerPositions.push(event.latLng.toJSON());
    // }
    // openInfoWindow(marker: MapMarker) {
    //     if (this.infoWindow != undefined) this.infoWindow.open(marker);
    // }

    // moveMap(event: google.maps.MapMouseEvent) {
    //     if (event.latLng != null) this.center = event.latLng.toJSON();
    // }
    // move(event: google.maps.MapMouseEvent) {
    //     if (event.latLng != null) this.display = event.latLng.toJSON();
    // }

     // Method to handle user's search input
    //  searchLocation() {
    //     const geocoder = new google.maps.Geocoder();
    //     geocoder.geocode({ address: this.searchQuery }, (results, status) => {
    //         if (status === 'OK' && results && results.length > 0) {
    //             const position = {
    //                 lat: results[0].geometry.location.lat(),
    //                 lng: results[0].geometry.location.lng(),
    //             };
    //             this.center = position;
    //             this.markerPositions = [position];
    //         } else {
    //             console.error('Geocode was not successful for the following reason: ' + status);
    //         }
    //     });
    // }

    

    // Method to open info window when marker is clicked
    // openInfoWindow(marker: MapMarker) {
    //     if (this.infoWindow != undefined) this.infoWindow.open(marker);
    // }

    // Method to update map center on mouse move
    // move(event: google.maps.MapMouseEvent) {
    //     if (event.latLng != null) this.display = event.latLng.toJSON();
    // }
}
    
