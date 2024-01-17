import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { convertJsonToFormData, pluckArrayWrapperData, pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { ResponseArrayWrapper, ResponseDataItem, ResponseItemWrapper } from '../models/response-wrappers.types';
import { SchedulingModel, SchedulingProduct, ShipmentLogsModel } from '../models/scheduling.model';
import { UpdatePlanningDock } from '../models/planning.model';
import { map } from 'rxjs/operators';
import { StatusListModel } from '../models/status-list.model';
import { BuildingModel } from '../models/building.model';
import { LocationModel } from '../models/location.model';
import { DockModel } from '../models/dock.model';
import { OperationModel } from '../models/operation.model';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private route: string = '/admin/plannings';
  constructor(private http: HttpClient) { }

  create(body: any): Observable<any> {
    const products = [...body.products];
    const customFieldCargoData = [...body.customFieldCargoData];
    const customFieldTransportData = [...body.customFieldTransportData];
    const customFieldAdditionalData = [...body.customFieldAdditionalData];

    delete body.products;
    delete body.customFieldCargoData;
    delete body.customFieldTransportData;
    delete body.customFieldAdditionalData;

    const data = convertJsonToFormData(body, 'data[attributes]');

    if (body.documents.length) {
      body.documents.forEach((file: File) => {
        data.append('documents[]', file);
      })
    }

    data.append('data[attributes][products]', JSON.stringify(products));
    data.append('data[attributes][customFieldCargoData]', JSON.stringify(customFieldCargoData));
    data.append('data[attributes][customFieldTransportData]', JSON.stringify(customFieldTransportData));
    data.append('data[attributes][customFieldAdditionalData]', JSON.stringify(customFieldAdditionalData));

    data.append('data[attributes][auto]', '');
    data.append('data[attributes][location]', '');

    if (body.warehouse) {
      data.append('data[attributes][warehouse]', '');
    }

    if (!body.dock) {
      data.append('data[attributes][dock]', '');
    }

    data.delete('data[attributes][documents][0]');
    data.delete('data[attributes][documents][1]');
    data.delete('data[attributes][documents][2]');

    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`, data);
  }

  edit(id: number, body: SchedulingModel): Observable<any> {
    const data = convertJsonToFormData(body, 'data[attributes]');
    data.delete('data[attributes][documents]');
    data.append('documents[]', body.documents as any);

    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`, wrapJsonForRequest(data));
  }

  get(id: number): Observable<any> {
    return this.http.get<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`)
                    .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`)
  }

  list(data: any): Observable<SchedulingModel[]> {
    return this.http.get<ResponseArrayWrapper<SchedulingModel[]>>(`${environment.apiUrl}${environment.apiVersion}${this.route}?query={"schedulingDate": "${data.schedulingDate}"}`)
                    .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<SchedulingModel[]>>(),
                      map((l: SchedulingModel[]) => {

                        l = l.map((p: SchedulingModel) => {
                          
                          p.statusListStatus = (<ResponseDataItem<StatusListModel>>p.statusListStatus)?.attributes ?? null;
                          p.warehouse = (<ResponseDataItem<BuildingModel>>p.warehouse)?.attributes || null;
                          p.location = (<ResponseDataItem<LocationModel>>p.location)?.attributes || null;
                          p.dock = (<ResponseDataItem<DockModel>>p.dock)?.attributes || null;

                          if (p.products.length) {
                            p.products = (<ResponseDataItem<SchedulingProduct>[]>p.products).map((product: ResponseDataItem<SchedulingProduct>) => product.attributes);
                          }

                          return p;
                        })

                        return l;
                      })
                    )
  }

  updatePlanningToDock(data: UpdatePlanningDock): Observable<any> {
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/admin/assigning-dock-to-plannings`, wrapJsonForRequest(data));
  }

  downloadPlannings(): Observable<any> {
    return this.http.get(`${environment.apiUrl}${environment.apiVersion}${this.route}/download`, { observe: 'response', responseType: 'blob'});
  }

  importPlannings(data: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}${this.route}/import`, data);
  }

  listLogs(id: number): Observable<SchedulingModel[]> {
    return this.http.get<ResponseArrayWrapper<SchedulingModel[]>>(`${environment.apiUrl}${environment.apiVersion}/admin/shipment-logs/${id}`)
                    .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<SchedulingModel[]>>(),
                      map((l: SchedulingModel[]) => {

                        l = l.map((p: SchedulingModel) => {
                          
                          p.statusListStatus = (<ResponseDataItem<StatusListModel>>p.statusListStatus)?.attributes ?? null;
                          p.operation = (<ResponseDataItem<OperationModel>>p.operation)?.attributes ?? null;
                          p.warehouse = (<ResponseDataItem<BuildingModel>>p.warehouse)?.attributes || null;

                          if (p.products.length) {
                            p.products = (<ResponseDataItem<SchedulingProduct>[]>p.products).map((product: ResponseDataItem<SchedulingProduct>) => product.attributes);
                          }

                          if (p.shipmentLogs?.length) {
                            p.shipmentLogs = (<ResponseDataItem<ShipmentLogsModel>[]>p.shipmentLogs).map((s: ResponseDataItem<ShipmentLogsModel>) => s.attributes);
                          }

                          return p;
                        })

                        return l;
                      })
                    )
  } 
}
