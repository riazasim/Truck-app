import { FormGroup, ValidatorFn } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { CountryModel } from "../core/models/location.model";
import { extractPhoneNumber } from "../shared/validators/phone-numbers";

export const getFormatHourSlot = (index: number): string => {
    const start = +index < 10 ? `0${index}:00` : `${index}:00`;
    const end = +index + 1 < 10 ? `0${index + 1}:00` :
        +index + 1 === 24 ? `00:00` : `${index + 1}:00`;

    return `${start} - ${end}`;
}

/* START GENERAL VALIDATION */

export const requiredValidation = (translate: TranslateService): ValidatorFn => RxwebValidators.required({
    message: translate.translations[translate.currentLang]['generics']['required']
})

export const pasteUpperCaseAlphaNumeric = (value: string): string =>  value.replace(/[\$\#\.\'\"\_\-]*/g, '').toUpperCase();

export const emailValidation = (translate: TranslateService): ValidatorFn => RxwebValidators.email({
    message: translate.translations[translate.currentLang]['messages']['email-input-error']
})

// #^[a-zA-Z][a-zA-Z\-\.\s]+#
// min: 2 char
// max: 64 char
export const nameRegex = /^[A-Za-z\-\.\s]{2,64}$/;

export const nameValidation = (translate: TranslateService): ValidatorFn => RxwebValidators.pattern({
    expression: {
        name: nameRegex
    },
    message: translate.translations[translate.currentLang]['messages']['name-error']
})

export const formatName = (value: string) => value.replace(/[\$\#\'\"\_]*/g, '').toUpperCase();
/* END GENERAL VALIDATION */



/* START LICENSE PLATES */

// "#[a-zA-Z0-9]+#"
// min 2 char
// max 15 char

export const licensePlateRegex = /^[A-Za-z0-9]{2,}$/;

export const truckLicensePlateValidation = (translate: TranslateService): ValidatorFn => RxwebValidators.pattern({
    expression: {
        truckLicensePlate: licensePlateRegex
    },
    message: translate.translations[translate.currentLang]['messages']['alpha-numeric-input-error']
})

export const formatLicensePlate = (licensePlate: string): string => {
    return licensePlate?.replace(/[\$\#\.\'\"\_\- ]*/g, '').toUpperCase();
}
/* END LICENSE PLATES */



/* START IDENTITY DOCUMENT NUMBER */
export const identityDocumentNumberRegex = /^[A-Za-z0-9]{4,64}$/;

export const identityDocumentNumberValidation = (translate: TranslateService): ValidatorFn => RxwebValidators.pattern({
    expression: {
        identityDocumentNumber: identityDocumentNumberRegex
    },
    message: translate.translations[translate.currentLang]['messages']['identity-document-nr-error']
})

export const formatIdentityDocumentNumber = (identityDocumentNumber: string) => {
    return identityDocumentNumber.replace(/[\$\#\.\'\"\_\- ]*/g, '').toUpperCase();
}

export const pasteFormatIdentityDocumentNumber = (event: ClipboardEvent, form: FormGroup, field: string): void => {
    event.stopPropagation();
    event.preventDefault();
    const clipboardData = event.clipboardData || (<any>window).clipboardData;
    const value = clipboardData.getData('text');
    form?.get(field)?.patchValue(pasteUpperCaseAlphaNumeric(value));
}

/* END IDENTITY DOCUMENT NUMBER */


/* START PHONE NUMBER */
// "#^[0-9][0-9\-\+\s]+#"
// min 2 char
// max 34 char
export const phoneNumberRegex = /^[0-9\-\+\s]{2,34}$/;
export const phoneNumberValidation = (translate: TranslateService, country: CountryModel): ValidatorFn => RxwebValidators.compose({
    validators: [RxwebValidators.digit()],
    conditionalExpression: (x: any) => {
     return (x?.phoneNumber?.length||null) !== (country.code ==='ro' ? country.mask.length+2: country.mask.length)
    },
    message:  country.code ==='ro' ? 
    translate.translations[translate.currentLang]['messages']['phone-number-error'].replace('{{length}}', extractPhoneNumber(country.mask).length+1) :
    translate.translations[translate.currentLang]['messages']['phone-number-error'].replace('{{length}}', extractPhoneNumber(country.mask).length)
})
/* END PHONE NUMBER */
