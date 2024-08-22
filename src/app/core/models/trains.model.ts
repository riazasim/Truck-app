export type TrainModel = {
    id?: number;
    locomotiveId?: number;
    name: string;
    registrationNumber:string;
    type:string;
    status:boolean;
    
}

export interface TrainTable {
    items: TrainModel[];
    noFiltered: number;
    noTotal: number;
}