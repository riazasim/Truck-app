import { BuildingModel } from "./building.model";
import { DockModel } from "./dock.model";
import { LocationModel } from "./location.model";
import { OperationModel } from "./operation.model";
import { ResponseDataItem } from "./response-wrappers.types";
import { StatusListModel } from "./status-list.model";
import { WorkingHoursModel } from "./working-hours.model";

export interface SchedulingModel {
    id?: number;
    schedulingDate: string | Date;
    operationType: string;
    auto: string;
    timeSlot: string;
    customerId: number;
    customerName: string;
    customer: number;
    destination: string;
    loadingAddress: string;
    truckLicensePlateFront: string;
    truckLicensePlateBack: string;
    driverName: string;
    driverId: string;
    sId?: number;
    driverContactNumber: string;
    customFieldTransportData: SchedulingCustomField[];
    customFieldCargoData: SchedulingCustomField[];
    customFieldAdditionalData: SchedulingCustomField[];
    products: ResponseDataItem<SchedulingProduct>[] | SchedulingProduct[];
    weight: number;
    operator: string;
    data: string;
    clientInstruction: string;
    operatorMention: string;
    documents: File[];
    location: ResponseDataItem<LocationModel> | LocationModel | number;
    warehouse:  ResponseDataItem<BuildingModel> | BuildingModel | number;
    dock: DockModel | ResponseDataItem<DockModel> | number;
    operation: ResponseDataItem<OperationModel> | OperationModel | number;
    statusListStatus: ResponseDataItem<StatusListModel> | StatusListModel | number;

    shipmentLogs?: ResponseDataItem<ShipmentLogsModel>[] | ShipmentLogsModel[];
}

export interface SchedulingPreviewModel extends SchedulingModel {
    location: LocationModel;
    warehouse: BuildingModel;
    dock: DockModel;
    operation: OperationModel;
    statusListStatus: StatusListModel;
}

export interface SchedulingCustomField {
    customField: number;
    name: string;
    value: string | string[] | number;
}

export interface SchedulingProduct {
    name: string;
    size: string;
    brand: string;
    batch: string;
    amount: number;
    weight: number;

    planningProductId?: number;
    productCode?: string;
    productId?: number;
    productName?: string;
}

export interface SchedulingDockModel {
    id: number;
    name: string;
    status: number;
    startSuspendTime: string;
    endSuspendTime: string;
    workingHour: null | ResponseDataItem<WorkingHoursModel> | WorkingHoursModel;
    dockToPlannings: ResponseDataItem<DockToPlanningModel>[] | DockToPlanningModel[];
    statusListStatus: null | ResponseDataItem<StatusListModel> | StatusListModel;
}

export interface DockToPlanningModel {
    hour: string;
    usedAllocatedTime: string;
    remainingTime: number;
    assigningDate: string;
}

export interface ShipmentLogsModel {
    shipmentLogId: number;
    operationType: string;
    sId: string;
    message: string;
    createdAt: string;
    userFullName: string;
}
