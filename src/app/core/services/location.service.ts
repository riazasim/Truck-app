import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, catchError, map} from 'rxjs';
import {
    convertJsonToFormData,
    pluckArrayPaginationWrapperData,
    pluckArrayWrapperData,
    pluckItemWrapperData,
    wrapJsonForRequest, wrapJsonListForRequest
} from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import {LocationModel, LocationTable} from '../models/location.model';
import {
  ResponseArrayPaginationWrapper,
  ResponseArrayWrapper,
  ResponseItemWrapper
} from '../models/response-wrappers.types';
import {VehicleTable} from "../models/vehicle.model";
import {CustomFieldData} from "../models/custom-field.model";

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private route: string = '/admin/locations';
  private locations: string = '/admin/change-locations';
  constructor(private http: HttpClient) {}

  create(data: LocationModel): Observable<any> {
    //const formData = convertJsonToFormData(data, 'data[attributes]');
    const formData = convertJsonToFormData(data,'');
    formData.delete('data[imgPreview]');
    formData.append('imgPreview', data.imgPreview);
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/createLocation`, formData);
  }

  edit(id:number,data: LocationModel): Observable<any> {
    //const formData = convertJsonToFormData(data, 'data[attributes]');
    data['locationId']=id;
    const formData = convertJsonToFormData(data, '');
    formData.delete('data[imgPreview]');
    formData.delete('data[locationId]');
    if (data.imgPreview) formData.append('imgPreview', data.imgPreview);
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/setLocationInfo`, formData);
  }

  get(id: number): Observable<any> {
      let data={
          locationId:id
      }
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getLocation`,data)
                    .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  delete(id: number): Observable<any> {
      let data={
          locationId:id
      }
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/deleteLocation`,data)
  }

  list(data: any): Observable<LocationModel[]> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`)
    .pipe(
      pluckArrayWrapperData<any, ResponseArrayWrapper<any>>(),
      catchError(() => [])
      )
  }

  listTable(data: any): Observable<LocationModel[]> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/table`)
    .pipe(
      pluckArrayWrapperData<any, ResponseArrayWrapper<any>>(),
      catchError(() => [])
      )
  }





  getLocationsByUser(): Observable<any> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.locations}`).pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>());
  }

  changeLocation(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}${this.locations}/${id}`, {});
  }

  pagination(data: any): Observable<LocationTable> {
    return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/paginateLocations`, wrapJsonForRequest(data))
        .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
            map((u: LocationTable) => {
              u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
              return u;
            })
        );
  }

    importLocaitons(list: LocationModel[]): Observable<any> {
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/importLocationsJson`, wrapJsonListForRequest('location', list));
    }
}
