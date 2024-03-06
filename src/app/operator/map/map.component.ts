import { Component, OnInit, ViewChild , Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

declare var google: any;
@Component({
    selector: 'app-map',
    templateUrl: 'map.component.html',
})
export class MapComponent implements OnInit {
    @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
    markerPositions: google.maps.LatLngLiteral[] = [];
    display: any;
    searchQuery: string = '';
    searchForm: FormGroup;

    center: google.maps.LatLngLiteral = {
        lat: 44.136797039769284,
        lng: 28.646488129424217,
    };
    zoom = 13;
    imageUrl = 'https://angular.io/assets/images/logos/angular/angular.svg';
    searchCard: google.maps.LatLngBoundsLiteral = {
        east: 10,
        north: 10,
        south: -10,
        west: -10,
    };
    @Input()
    public Title: string | undefined;

    constructor() {
        this.searchForm = new FormGroup({
            searchQuery: new FormControl('')
          });
    }
    ngOnInit(): void {
        const map = new google.maps.Map(document.getElementById('map'), {
           center: { lat: 44.138896, lng: 28.821234 },
           zoom: 12
         });
         const overlayDiv = document.getElementById('overlay');
         map.controls[google.maps.ControlPosition.TOP_LEFT].push(overlayDiv);
     }

     searchLocation() {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: this.searchQuery }, (results: any, status: any) => {
            if (status === 'OK' && results && results.length > 0) {
                const position = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                };
                this.center = position;
                this.markerPositions = [position];
            } else {
                console.error('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    addMarker() {
        this.markerPositions = [];
        const position = {
            lat: parseFloat(this.searchQuery.split(',')[0].trim()),
            lng: parseFloat(this.searchQuery.split(',')[1].trim()),
        };
        this.markerPositions.push(position);
        this.center = position;
    }

    openInfoWindow(marker: MapMarker) {
        if (this.infoWindow != undefined) this.infoWindow.open(marker);
    }

    move(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.display = event.latLng.toJSON();
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

