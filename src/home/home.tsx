import { Layout } from "../layout.js";
import { IntegrationConnectionConfiguration } from "../data-source/google/types.js";

interface HomepageProps {
  integrations: IntegrationConnectionConfiguration[];
}

const columnDefs = [
  { 
    field: "integrationName", 
    headerName: "Integration", 
    pinned: "left", 
    width: 180,
    cellStyle: { fontWeight: 'bold' },
    filter: 'agTextColumnFilter'
  },
  {
    headerName: "Products",
    children: [
      { field: "productSpecifications.products.convert", headerName: "Convert", width: 90, cellRenderer: "booleanRenderer" },
      { field: "productSpecifications.products.onSiteMessages", headerName: "On-site Messages", width: 140, cellRenderer: "booleanRenderer" },
      { field: "productSpecifications.products.retargeting", headerName: "Retargeting", width: 110, cellRenderer: "booleanRenderer" },
      { field: "productSpecifications.products.paidSearch", headerName: "Paid Search", width: 110, cellRenderer: "booleanRenderer" },
    ],
  },
  {
    headerName: "DMP",
    children: [
      { field: "productSpecifications.dmp.dmp", headerName: "DMP", width: 80 },
      { field: "productSpecifications.dmp.priceMatch", headerName: "Price Match", width: 120 },
      { field: "productSpecifications.dmp.crmIntegration", headerName: "CRM Integration", width: 150 },
      { field: "productSpecifications.dmp.guestBehaviouralData", headerName: "Guest Behavioural Data", width: 180 },
    ],
  },
  {
    headerName: "Email Activation",
    children: [
      { field: "productSpecifications.emailActivation.cartAbandonment", headerName: "Cart Abandonment", width: 150 },
      { field: "productSpecifications.emailActivation.backInStock", headerName: "Back in Stock", width: 130 },
    ],
  },
  {
    headerName: "WIHP Connectivity",
    children: [
      { field: "connectivitySpecifications.wihp.metasChannels", headerName: "Metas Channels", width: 200 },
      { field: "connectivitySpecifications.wihp.coverage", headerName: "Coverage", width: 100 },
      { field: "connectivitySpecifications.wihp.priceMatch", headerName: "Price Match", width: 120 },
    ],
  },
  {
    headerName: "Rockhopper Connectivity",
    children: [
      { field: "connectivitySpecifications.rockhopper.metasChannels", headerName: "Metas Channels", width: 200 },
      { field: "connectivitySpecifications.rockhopper.coverage", headerName: "Coverage", width: 100 },
      { field: "connectivitySpecifications.rockhopper.priceMatch", headerName: "Price Match", width: 120 },
    ],
  },
  {
    headerName: "Additional Comments",
    children: [
      { field: "additionalComments.salesNeedToKnow", headerName: "Sales Notes", width: 200 },
      { field: "additionalComments.technicalImplementationComments", headerName: "Tech Notes", width: 200 },
      { field: "additionalComments.knownAdditionalFees", headerName: "Additional Fees", width: 200 },
    ],
  },
];

export function Homepage({ integrations }: HomepageProps) {
  return <Layout>
      <div id="data-grid" class="ag-theme-quartz" style="height: 100vh; width: 100%;"
           data-integrations={JSON.stringify(integrations)}
           data-columns={JSON.stringify(columnDefs)}>
      </div>
      {integrations.length === 0 && (
        <p>No integrations available at the moment.</p>
      )}
  </Layout>
}