import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { pluckArrayWrapperData, pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { ProductModel, WarehouseAvailablityResponse } from '../models/product.model';
import { ResponseArrayWrapper, ResponseDataItem, ResponseItemWrapper } from '../models/response-wrappers.types';
import { LocationModel } from '../models/location.model';
import { BuildingModel } from '../models/building.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private route: string = '/admin/products'
  private warehouseGetRoute: string = '/admin/product-warehouse-availabilities-by-product';
  private warehousePostRoute: string = '/admin/product-warehouse-availabilities';
  constructor(private http: HttpClient) { }

  create(data: ProductModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`, wrapJsonForRequest(data));
  }

  edit(id: number, data: ProductModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`, wrapJsonForRequest(data));
  }

  get(id: number): Observable<ProductModel> {
    return this.http.get<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`)
                    .pipe(pluckItemWrapperData<ProductModel, ResponseItemWrapper<ProductModel>>(),
                        map((p: ProductModel) => {
                          p.locations = (<ResponseDataItem<LocationModel>[]>p.locations).map((l) => (l.attributes))
                                                                                        .map(l => {
                            l.warehouses = (<ResponseDataItem<BuildingModel>[]>l.warehouses).map(w => <number>w.attributes.id);
                            return l;
                          });

                          return p;
                        })
                    )
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`)
  }

  list(data: any): Observable<ProductModel[]> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`)
                    .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
  }

  listWarehouses(id: number): Observable<WarehouseAvailablityResponse[]> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.warehouseGetRoute}/${id}`)
                    .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<WarehouseAvailablityResponse[]>>(),
                      map(l => {
                        l = l.map((b: WarehouseAvailablityResponse) => {
                          b.warehouses = (<ResponseDataItem<BuildingModel>[]>b.warehouses).map(w => <number>w.attributes.id);

                          return b;
                        })

                        return l;
                      })
                    )
  }

  addWarehouses(id: number, data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}${this.warehousePostRoute}/${id}`, wrapJsonForRequest({availabilities: data}));
  }
}
