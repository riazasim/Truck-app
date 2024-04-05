import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ResponseArrayPaginationWrapper } from "../models/response-wrappers.types";
import { environment } from "src/environments/environment";
import { pluckArrayPaginationWrapperData, wrapJsonForRequest } from "src/app/shared/utils/api.functions";
import { CustomFieldData } from "../models/custom-field.model";

@Injectable({
    providedIn: 'root'
})
export class MapSerachService {
    constructor(private readonly http: HttpClient) { }
    getMicroPlanningConvoyes(data: any): Observable<any> {
        return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/microconvoyes`, wrapJsonForRequest(data))
            .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
                map((u: any) => {
                    u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
                    return u;
                })
            );
    }
}