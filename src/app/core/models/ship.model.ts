export type ShipModel = {
    id?: number;
    shipId?: number;
    name: string;
    registrationNo:string;
    ais:string;
    selfPropelled: string;    
    lockType:string;
    length:number;
    width: number;
    maxDraft: number;    
    aerialGauge:number;
    maxCapacity:number;
}

export interface ShipTable {
    items: ShipModel[];
    noFiltered: number;
    noTotal: number;
}
