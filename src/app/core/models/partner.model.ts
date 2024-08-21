export type PartnerModel = {
    id?: number;
    partnerId?: number;
    name: string;
    email: string;
    phone: string;
    status: boolean;
    // contactNumber: string;
    address: string;
    // partnerSpecialStatus: number;
    type: string;
    // blockSidStatus: boolean;
    // partnerDockRelationships?: PartnerDockRelationships[] | DockOnlyRelationship[] | number | number[];
    // docks?: number[];
    // partners?: number[];
}

export interface PartnerTable {
  items: PartnerModel[];
  noFiltered: number;
  noTotal: number;
}

// export type PartnerDockRelationships = {
//     id: number;
//     partners: ResponseDataItem<PartnerModel>[];
//     dock: ResponseDataItem<DockModel>[];
//     docks: ResponseDataItem<DockModel>[];
// }

// export type DockOnlyRelationship = {
//     attributes: {
//       id: number;
//       dock: ResponseDataItem<DockModel>[]
//     }
//   }
