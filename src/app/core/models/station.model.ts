export type StationModel = {
    id?: number;
    stationId?: number;
    name: string;
    type:string;
}

export interface StationTable {
    items: StationModel[];
    noFiltered: number;
    noTotal: number;
}
