import { Component, ViewChild } from '@angular/core';
import { MapInfoWindow } from '@angular/google-maps';
import { BehaviorSubject } from 'rxjs';

declare var google: any;
@Component({
    selector: 'app-map',
    templateUrl: 'map.component.html',
    styleUrl: './map.component.scss'
})
export class MapComponent {
    map: google.maps.Map;
    @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
    markerPositions: any[] = [];
    display: any;
    searchQuery: string = '';
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    dataSource: any[] = [];
    marker: any;
    filters: any = { statusFilters: [], timeFilter: {} };

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


    constructor() { }

    retrieveMapData(results: any): void {
        if (results.length <= 0) {
            this.markerPositions = [];
        }
        else {
            this.markerPositions = [];
            results.forEach((item: any) => {
                if (item && item.sidCoordinates) {
                    const coordinates = item.sidCoordinates.split(',');
                    const markerPosition = new google.maps.LatLng(parseFloat(coordinates[0]), parseFloat(coordinates[1]));
                    this.markerPositions.push({ position: markerPosition, title: item?.ship?.name });
                }
            });
        }
        // this.isLoading$.next(true);
        // let data = {
        //     "start": 0,
        //     "length": 5,
        //     "filters": ["","","",filters.statusFilters,"","","",filters.timeFilter],
        //     "order": [{"dir": "DESC", "column": 0}]
        // }
        // this.microService.getMicroPlanningConvoyes(data).subscribe({
        // next: response => {
        //     this.dataSource = response.items;
        //     this.markerPositions = [];
        //     this.dataSource.forEach(item => {
        //         if (item && item.sidCoordinates) {
        //             const coordinates = item.sidCoordinates.split(',');
        //             const markerPosition = new google.maps.LatLng(parseFloat(coordinates[0]), parseFloat(coordinates[1]));
        //             this.markerPositions.push({position : markerPosition , title : item?.ship?.name});
        //         }
        //     });
        // const d2 = new google.maps.LatLng(parseFloat('37.4239163'), parseFloat('-122.0947209'));
        // this.markerPositions.push(d2);
        // if(this.markerPositions.length > 0){
        //     this.markerPositions.forEach(position => {
        //         this.marker = new google.maps.Marker({
        //             map: this.map,
        //             position: position,
        //             title: 'Marker Title'
        //         });
        //     });
        // }
        // else{
        //     console.log('marker:', this.marker)
        // }
        //         this.cd.detectChanges();
        //         this.isLoading$.next(false);
        //     },
        //     error: ()=>{
        //         this.isLoading$.next(false);
        //     }
        // });
    }

    mapLoading(ev : any){
        this.isLoading$.next(ev)
    }

}

