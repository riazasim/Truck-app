import { DockModel } from "./dock.model";
import { ResponseDataItem } from "./response-wrappers.types";

export type PartnerModel = {
    id?: number;
    fullName: string;
    email: string;
    status: boolean;
    contactNumber: string;
    address: string;
    partnerSpecialStatus: number;
    partnerType: string;
    blockSidStatus: boolean;
    partnerDockRelationships?: PartnerDockRelationships[] | DockOnlyRelationship[] | number | number[];
    docks?: number[];
    partners?: number[];
}

export type PartnerDockRelationships = {
    id: number;
    partners: ResponseDataItem<PartnerModel>[];
    dock: ResponseDataItem<DockModel>[];
    docks: ResponseDataItem<DockModel>[];
}

export type DockOnlyRelationship = {
    attributes: {
      id: number;
      dock: ResponseDataItem<DockModel>[]
    }
  }
