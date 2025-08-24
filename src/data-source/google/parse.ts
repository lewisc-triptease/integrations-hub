import {
  PRODUCTS_KEYS, DMP_KEYS, EMAIL_ACT_KEYS, CONN_SPEC_KEYS, ADDL_COMMENTS_KEYS,
  IntegrationConnectionConfiguration, toCamelCase, cleanText
} from "./types";

type HeaderInfo = {
  colIndex: number;
  sectionText: string;
  subsectionText: string;
  key: string;
};

const coerce = (v: string): string | null => {
  const t = (v ?? "").trim();
  if (t === "" || t === "-") return null;
  return t;
};

const leftFill = (arr: (string | undefined)[]): string[] => {
  const out: string[] = [];
  let last = "";
  for (const v of arr) {
    const s = (v ?? "").trim();
    if (s) { last = s; out.push(s); } else { out.push(last); }
  }
  return out;
};

const tierLabels = (r1: string[], r2: string[]) => {
  const a = leftFill(r1);
  const b = leftFill(r2);
  return a.map((_, i) => [a[i], b[i]].filter(Boolean).join(" / "));
};

const detectProvider = (sectionText: string, subsectionText: string): "wihp" | "rockhopper" | null => {
  const subsectionLower = subsectionText.toLowerCase();
  
  if (subsectionLower.includes("wihp - meta conditions")) {
    return "wihp";
  }
  
  if (subsectionLower.includes("rockhopper") || subsectionLower.includes("wihphopper")) {
    return "rockhopper";
  }

  if (subsectionLower.includes("wihp") && !subsectionLower.includes("wihphopper")) {
    return "wihp";
  }

  return null;
};

export function parseIntegrationConfigsFromRows(rows: string[][]): IntegrationConnectionConfiguration[] {
  if (!rows || rows.length < 6) return [];

  const sectionRow1 = rows[0] ?? [];
  const sectionRow2 = rows[1] ?? [];
  const subsectionRow1 = rows[2] ?? [];
  const subsectionRow2 = rows[3] ?? [];
  const keyRow = rows[4] ?? [];

  const sections = tierLabels(sectionRow1, sectionRow2);
  const subsections = tierLabels(subsectionRow1, subsectionRow2);
  const keys = keyRow.map((k) => (k ?? "").trim());

  const width = Math.max(sections.length, subsections.length, keys.length);
  const headers: HeaderInfo[] = [];
  for (let i = 0; i < width; i++) {
    const key = keys[i] ?? "";
    if (!key) continue;
    headers.push({
      colIndex: i,
      sectionText: sections[i] ?? "",
      subsectionText: subsections[i] ?? "",
      key,
    });
  }

  const data = rows.slice(5);
  const out: IntegrationConnectionConfiguration[] = [];

  for (const r of data) {
    if (!r || !r.some((v) => (v ?? "").trim() !== "")) continue;

    const cfg: IntegrationConnectionConfiguration = {
      integrationName: (r[0] ?? "").trim(),
      productSpecifications: {
        products: {
          convert: null,
          onSiteMessages: null,
          retargeting: null,
          paidSearch: null,
        },
        dmp: { 
          dmp: null,
          priceMatch: null,
          crmIntegration: "",
          guestBehaviouralData: null,
        },
        emailActivation: {
          cartAbandonment: null,
          backInStock: null,
        },
      },
      connectivitySpecifications: {
        wihp: {
          metasChannels: null,
          coverage: null,
          blackoutWhenTheBetIsReducedDueToBeingInDisparity: null,
          parityBoost: null,
          priceMatch: null,
          strikethrough: null,
          geoRates: null,
          deviceRates: null,
          calloutsRoomBundles: null,
        }, 
        rockhopper: {
          metasChannels: null,
          coverage: null,
          blackoutWhenTheBetIsReducedDueToBeingInDisparity: null,
          parityBoost: null,
          priceMatch: null,
          strikethrough: null,
          geoRates: null,
          deviceRates: null,
          calloutsRoomBundles: null,
        } 
      },
      additionalComments: {
        knownAdditionalFees: null,
        salesNeedToKnow: null,
        technicalImplementationComments: null,
      },
    };

    for (const h of headers) {
      const raw = (r[h.colIndex] ?? "").trim();
      const value = coerce(raw);
      const key = h.key as string;
      const camelKey = toCamelCase(key);

      if (CONN_SPEC_KEYS.some(k => cleanText(key).toLowerCase().includes(cleanText(k).toLowerCase())) && 
          (cleanText(h.sectionText).toLowerCase().includes('connectivity') || 
           cleanText(h.subsectionText).toLowerCase().includes('wihp') ||
           cleanText(h.subsectionText).toLowerCase().includes('rockhopper'))) {
        let provider = detectProvider(h.sectionText, h.subsectionText);
        
        if (!provider) {
          const connectivityColumns = headers
            .filter(header => CONN_SPEC_KEYS.some(k => cleanText(header.key).startsWith(cleanText(k))))
            .sort((a, b) => a.colIndex - b.colIndex);
          
          const currentColumnIndex = connectivityColumns.findIndex(col => col.colIndex === h.colIndex);
          
          if (currentColumnIndex < connectivityColumns.length / 2) {
            provider = "wihp";
          } else {
            provider = "rockhopper";
          }
        }
        
        if (provider) {
          if (camelKey === 'metasChannels') cfg.connectivitySpecifications[provider].metasChannels = value;
          else if (camelKey === 'coverage') cfg.connectivitySpecifications[provider].coverage = value;
          else if (camelKey === 'blackoutWhenTheBetIsReducedDueToBeingInDisparity') cfg.connectivitySpecifications[provider].blackoutWhenTheBetIsReducedDueToBeingInDisparity = value;
          else if (camelKey === 'parityBoost') cfg.connectivitySpecifications[provider].parityBoost = value;
          else if (camelKey.startsWith('priceMatch')) cfg.connectivitySpecifications[provider].priceMatch = value;
          else if (camelKey === 'strikethrough') cfg.connectivitySpecifications[provider].strikethrough = value;
          else if (camelKey === 'geoRates') cfg.connectivitySpecifications[provider].geoRates = value;
          else if (camelKey === 'deviceRates') cfg.connectivitySpecifications[provider].deviceRates = value;
          else if (camelKey === 'calloutsRoomBundles') cfg.connectivitySpecifications[provider].calloutsRoomBundles = value;
        }
        continue;
      }
      
      if (PRODUCTS_KEYS.some(k => cleanText(key).startsWith(cleanText(k)))) {
        if (camelKey === 'convert') cfg.productSpecifications.products.convert = value;
        else if (camelKey === 'onSiteMessages') cfg.productSpecifications.products.onSiteMessages = value;
        else if (camelKey === 'retargeting') cfg.productSpecifications.products.retargeting = value;
        else if (camelKey === 'paidSearch') cfg.productSpecifications.products.paidSearch = value;
        continue;
      }
      if (DMP_KEYS.some(k => cleanText(key).startsWith(cleanText(k)))) {
        if (key === "CRM Integration") {
          cfg.productSpecifications.dmp.crmIntegration = value ?? "";
        } else if (camelKey === 'dmp') cfg.productSpecifications.dmp.dmp = value;
        else if (camelKey === 'priceMatch') cfg.productSpecifications.dmp.priceMatch = value;
        else if (camelKey === 'guestBehaviouralData') cfg.productSpecifications.dmp.guestBehaviouralData = value;
        continue;
      }
      if (EMAIL_ACT_KEYS.some(k => cleanText(key).startsWith(cleanText(k)))) {
        if (camelKey === 'cartAbandonment') cfg.productSpecifications.emailActivation.cartAbandonment = value;
        else if (camelKey === 'backInStock') cfg.productSpecifications.emailActivation.backInStock = value;
        continue;
      }
      if (ADDL_COMMENTS_KEYS.some(k => cleanText(key).startsWith(cleanText(k)))) {
        if (camelKey === 'knownAdditionalFees') cfg.additionalComments.knownAdditionalFees = value;
        else if (camelKey === 'salesNeedToKnow') cfg.additionalComments.salesNeedToKnow = value;
        else if (camelKey === 'technicalImplementationComments') cfg.additionalComments.technicalImplementationComments = value;
      }
    }

    out.push(cfg);
  }

  return out;
}