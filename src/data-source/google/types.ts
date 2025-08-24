export const PRODUCTS_KEYS = [
    "Booking Engine",
    "Convert",
    "On-site Messages",
    "Retargeting",
    "Paid Search",
] as const;

export const DMP_KEYS = [
    "DMP",
    "Price Match",
    "CRM Integration",
    "Guest Behavioural Data",
] as const;

export const EMAIL_ACT_KEYS = [
    "Cart Abandonment",
    "Back in Stock",
] as const;

export const CONN_SPEC_KEYS = [
    "Metas Channels",
    "Coverage",
    "Blackout When the bet is reduced due to being in disparity",
    "Parity Boost",
    "Price Match",
    "Strikethrough",
    "Geo Rates",
    "Device Rates",
    "Callouts & Room Bundles:",
] as const;

export const ADDL_COMMENTS_KEYS = [
    "Known Additional Fees",
    "Sales need to know",
    "Technical Implementation Comments",
] as const;

export type StrOrNull = string | null;

export function cleanText(str: string): string {
    return str
        .split('\n')[0]
        .trim()
        .replace(/\s+/g, ' ');
}

export function toCamelCase(str: string): string {
    const cleaned = cleanText(str);
    return cleaned
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^[A-Z]/, (chr) => chr.toLowerCase());
}

export type ProductsCamelCase = {
    convert: StrOrNull;
    onSiteMessages: StrOrNull;
    retargeting: StrOrNull;
    paidSearch: StrOrNull;
};

export type DMPCamelCase = {
    dmp: StrOrNull;
    priceMatch: StrOrNull;
    crmIntegration: string;
    guestBehaviouralData: StrOrNull;
};

export type EmailActivationCamelCase = {
    cartAbandonment: StrOrNull;
    backInStock: StrOrNull;
};

export type ConnectivitySpecificationCamelCase = {
    metasChannels: StrOrNull;
    coverage: StrOrNull;
    blackoutWhenTheBetIsReducedDueToBeingInDisparity: StrOrNull;
    parityBoost: StrOrNull;
    priceMatch: StrOrNull;
    strikethrough: StrOrNull;
    geoRates: StrOrNull;
    deviceRates: StrOrNull;
    calloutsRoomBundles: StrOrNull;
};

export type AdditionalCommentsCamelCase = {
    knownAdditionalFees: StrOrNull;
    salesNeedToKnow: StrOrNull;
    technicalImplementationComments: StrOrNull;
};

export type Products = ProductsCamelCase;
export type DMP = DMPCamelCase;
export type EmailActivation = EmailActivationCamelCase;
export type ConnectivitySpecification = ConnectivitySpecificationCamelCase;
export type AdditionalComments = AdditionalCommentsCamelCase;

export interface IntegrationConnectionConfiguration {
    integrationName: string;
    productSpecifications: {
        products: Products;
        dmp: DMP;
        emailActivation: EmailActivation;
    };
    connectivitySpecifications: {
        wihp: ConnectivitySpecification;
        rockhopper: ConnectivitySpecification;
    };
    additionalComments: AdditionalComments;
}