import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { pluckArrayWrapperData, pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { DockOnlyRelationship, PartnerDockRelationships, PartnerModel } from '../models/partner.model';
import { ResponseArrayWrapper, ResponseItemWrapper } from '../models/response-wrappers.types';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private route: string = '/admin/partners';
  constructor(private http: HttpClient) { }

  create(data: PartnerModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`, wrapJsonForRequest(data));
  }

  edit(id: number, data: PartnerModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`, wrapJsonForRequest(data));
  }

  get(id: number): Observable<any> {
    return this.http.get<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`)
                    .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
                        map((p: PartnerModel) => {

                          if ((<DockOnlyRelationship[]>p.partnerDockRelationships).length) {
                            p['docks'] = (<DockOnlyRelationship[]>p.partnerDockRelationships).flatMap((p) => 
                                                                          p.attributes.dock.map(x => (<number>x.attributes.id)));
                          } else {
                            p['docks'] = [];
                          }

                          return p;
                        })
                    )
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`)
  }

  list(data: any): Observable<PartnerModel[]> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`)
                    .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>(),
                      map((l: PartnerModel[]) => l.map((p: PartnerModel) => {
                        if ((<PartnerDockRelationships[]>p.partnerDockRelationships).length) {
                          p['partners'] = (<PartnerDockRelationships[]>p.partnerDockRelationships)[0].partners.map(sp => <number>sp.attributes.id);
                          p['docks'] = (<PartnerDockRelationships[]>p.partnerDockRelationships)[0].docks.map(d => <number>d.attributes.id);
                        } else {
                          p['partners'] = [];
                          p['docks'] = [];
                        }

                        return p;
                      }))
                    )
  }
}
