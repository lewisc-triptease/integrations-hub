import { describe, it, expect } from "bun:test";
import { parseIntegrationConfigsFromRows } from "../../../src/data-source/google/parse.js";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import path from "node:path";

describe("parseIntegrationConfigsFromRows with real CSV data", () => {
  it("correctly parses CSV data and maps values to correct rows", () => {
    const csvPath = path.join(import.meta.dir, "fixtures", "list-of-connections.csv");
    const csvContent = readFileSync(csvPath, "utf-8");
    
    const rows = parse(csvContent, {
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true
    });
    const configs = parseIntegrationConfigsFromRows(rows);

    expect(configs.length).toBeGreaterThan(0);

    const aboveproperty = configs.find(config => 
      config.integrationName === "aboveproperty"
    );
    expect(aboveproperty).toBeDefined();
    expect(aboveproperty?.integrationName).toBe("aboveproperty");
    expect(aboveproperty?.productSpecifications.products.convert).toBe("Y");
    expect(aboveproperty?.productSpecifications.products.onSiteMessages).toBe("Y");
    expect(aboveproperty?.productSpecifications.products.retargeting).toBe("Y");
    expect(aboveproperty?.productSpecifications.products.paidSearch).toBe("Y");

    const alaric = configs.find(config => 
      config.integrationName === 'Alaric'
    );
    expect(alaric).toBeDefined();
    expect(alaric?.integrationName).toBe("Alaric");
    expect(alaric?.productSpecifications.dmp.priceMatch).toBe("N");
    expect(alaric?.connectivitySpecifications.wihp.metasChannels).toBe("Google, Tripadvisor, Trivago, Bing, Kayak, Skyscanner, Wego");
    expect(alaric?.connectivitySpecifications.wihp.coverage).toBe("180x7");

    const availpro = configs.find(config => 
      config.integrationName === 'Availpro'
    );
    expect(availpro).toBeDefined();
    expect(availpro?.integrationName).toBe("Availpro");
    expect(availpro?.productSpecifications.emailActivation.cartAbandonment).toBe("Y");
    
    expect(availpro?.connectivitySpecifications.wihp.metasChannels).toBe("Google, Tripadvisor, Trivago, Bing, Kayak, Skyscanner, Wego");
    expect(availpro?.connectivitySpecifications.wihp.coverage).toBe("180x7");
    expect(availpro?.connectivitySpecifications.wihp.priceMatch).toBe("N");
    
    expect(availpro?.connectivitySpecifications.rockhopper.metasChannels).toBe("Google");
    expect(availpro?.connectivitySpecifications.rockhopper.coverage).toBe("180x2");
    expect(availpro?.connectivitySpecifications.rockhopper.priceMatch).toBe( null);

    const cloudbeds = configs.find(config => 
      config.additionalComments.salesNeedToKnow?.includes("Only gallery view layout supported")
    );
    expect(cloudbeds).toBeDefined();
    expect(cloudbeds?.integrationName).toBe("Cloudbeds");
    expect(cloudbeds?.productSpecifications.dmp.dmp).toBe("Y");
    expect(cloudbeds?.productSpecifications.emailActivation.cartAbandonment).toBe("Y");
    expect(cloudbeds?.connectivitySpecifications.wihp.priceMatch).toBe("FALSE");
    expect(cloudbeds?.connectivitySpecifications.rockhopper.priceMatch).toBe("FALSE");

    const siteminder = configs.find(config => 
      config.additionalComments.knownAdditionalFees?.includes("Triptease pays Siteminder ongoing fees")
    );
    expect(siteminder).toBeDefined();
    expect(siteminder?.integrationName).toBe("Siteminder");
    expect(siteminder?.productSpecifications.dmp.dmp).toBe("Y");
    expect(siteminder?.productSpecifications.dmp.priceMatch).toBe("Y");
    expect(siteminder?.productSpecifications.emailActivation.cartAbandonment).toBe("Y");
    
    expect(siteminder?.connectivitySpecifications.wihp.metasChannels).toBe("Google, Tripadvisor, Trivago, Bing, Kayak, Skyscanner, Wego");
    expect(siteminder?.connectivitySpecifications.rockhopper.metasChannels).toBe("Google, Tripadvisor, Trivago, Bing, Kayak, Skyscanner, Wego");
    
    const cubilis = configs.find(config => 
      config.additionalComments.technicalImplementationComments?.includes("Check Ubio connectivity")
    );
    expect(cubilis).toBeDefined();
    expect(cubilis?.integrationName).toBe("Cubilis");
    expect(cubilis?.connectivitySpecifications.wihp.metasChannels).toBe("Google, Tripadvisor, Trivago, Bing, Kayak, Skyscanner, Wego");
    expect(cubilis?.connectivitySpecifications.wihp.coverage).toBe("180x7");
    expect(cubilis?.connectivitySpecifications.rockhopper.metasChannels).toBe('N');
    expect(cubilis?.connectivitySpecifications.rockhopper.coverage).toBe('N');
  });
});