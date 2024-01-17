export interface SignupModel {
    user:{
        email: string;
     },
    userSetting:{
        firstName: string;
        lastName: string;
        language: "EN" | "RO";
        phone: string;
        phoneRegionCode: string;
    }

}
