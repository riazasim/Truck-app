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
    myMarkerPositions: any[] = [];
    otherMarkerPositions: any[] = [];
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
            this.myMarkerPositions = [];
            this.otherMarkerPositions = [];
        }
        else {
            this.myMarkerPositions = [];
            this.otherMarkerPositions = [];
            results.forEach((item: any) => {
                if (item && item.sidCoordinates) {
                    const coordinates = item.sidCoordinates.split(',');
                    const markerPosition = new google.maps.LatLng(parseFloat(coordinates[0]), parseFloat(coordinates[1]));
                    if (item.isOrgOwner) this.myMarkerPositions.push({ position: markerPosition, title: item?.ship?.name });
                    else this.otherMarkerPositions.push({ position: markerPosition, title: item?.ship?.name });
                }
            });
        }
    }

    mapLoading(ev: any) {
        this.isLoading$.next(ev)
    }

}

