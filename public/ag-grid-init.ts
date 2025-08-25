import { createGrid, type GridOptions, type ColDef, type ColGroupDef } from 'ag-grid-community';

// Boolean renderer for Y/N values
function booleanRenderer(params: any) {
  if (params.value === 'Y' || params.value === 'y') {
    return '<span style="color: #28a745; font-weight: bold;">✓</span>';
  } else if (params.value === 'N' || params.value === 'n') {
    return '<span style="color: #dc3545; font-weight: bold;">✗</span>';
  }
  return params.value || '';
}

const columnDefs: (ColDef | ColGroupDef)[] = [
  {
    headerName: "Integration",
    field: "integrationName",
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
      { field: "additionalComments.salesNeedToKnow", headerName: "Sales Notes", width: 750, wrapText: true },
      { field: "additionalComments.technicalImplementationComments", headerName: "Tech Notes", width: 750, wrapText: true },
      { field: "additionalComments.knownAdditionalFees", headerName: "Additional Fees", width: 750, wrapText: true },
    ],
  },
];

document.addEventListener('DOMContentLoaded', function() {
  const gridDiv = document.querySelector<HTMLDivElement>('div#data-grid');
  
  if (gridDiv) {
    try {
      const integrationsAttr = gridDiv.getAttribute('data-integrations');
      
      if (integrationsAttr) {
        const integrations = JSON.parse(integrationsAttr);

        if (integrations && integrations.length > 0) {
          const gridOptions: GridOptions = {
            columnDefs,
            rowData: integrations,
            defaultColDef: {
              sortable: true,
              filter: true,
              resizable: true,
              minWidth: 160,
              flex: 1,
            },
            components: {
              booleanRenderer
            },
            autoSizeStrategy: {
              type: 'fitGridWidth',
              defaultMinWidth: 100,
            },
            pagination: true,
            paginationPageSize: 20,
            paginationPageSizeSelector: [10, 20, 50, 100],
            suppressRowClickSelection: true,
            enableRangeSelection: true,
            enableCellTextSelection: true,
            copyHeadersToClipboard: true,
            suppressCopyRowsToClipboard: false,
            rowHeight: 40,
            headerHeight: 45,
            animateRows: true,
            enableBrowserTooltips: true,
          };
          
          createGrid(gridDiv, gridOptions);
        }
      }
    } catch (error) {
      console.error('Failed to initialize ag-grid:', error);
    }
  }
});
