export interface UpdatePlanningDock {
    assigningDate: string;
    hour: string;
    planning: number;
    dock: number;
    statusListStatus: number;
}

export interface convoyModel {
    id?: number;
    navigationType: string;
    ship: string;
    shipType: string;
    pavilion: number;
    enginePower: number;
    lengthOverall: number;
    width: number;
    maxDraft: number;
    maxQuantity: number;
    agent: string;
    maneuvering: string;
    shipowner: string;
    purpose: string;
    operator: string;
    trafficType: string;
    operatonType: string;
    cargo: string;
    quantity: number;
    unitNo: string;
    originPort: string;
    destination: string;
    observation: string;
    additionalOperator: string;
    clientComments: string;
    operatorComments: string;
}

export interface PlanningModel {
    id?: number;
    planningId?: number;
    sId?:number;
    relativeTimeArrival?:string;
    shipmentStatus?:string;
    routingDetail: {
        convoyType: string;
        estimatedTimeArrival: string;
        locationPort: string;
        zone: number;
        departurePort: string;
        arrivalPort: string;
        pilotCompany: string;
        length: number;
        width: number;
        maxDraft: number;
        arrivalGuage: number;
        maxCapacity: number;
        lockType: string;
    }
    convoyDetail: convoyModel[]
    documents: File[];
}
export interface PlanningTable {
    items: PlanningModel[];
    noFiltered: number;
    noTotal: number;
}
