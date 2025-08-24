// Boolean renderer for Y/N values
function booleanRenderer(params) {
  if (params.value === 'Y' || params.value === 'y') {
    return '<span style="color: #28a745; font-weight: bold;">✓</span>';
  } else if (params.value === 'N' || params.value === 'n') {
    return '<span style="color: #dc3545; font-weight: bold;">✗</span>';
  }
  return params.value || '';
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('ag-grid init script loaded');
  console.log('agGrid available:', typeof agGrid);
  
  const gridDiv = document.querySelector('#data-grid');
  
  if (gridDiv) {
    try {
      const integrationsAttr = gridDiv.getAttribute('data-integrations');
      const columnsAttr = gridDiv.getAttribute('data-columns');
      
      if (integrationsAttr && columnsAttr) {
        const integrations = JSON.parse(integrationsAttr);
        const columnDefs = JSON.parse(columnsAttr);
        
        if (integrations && integrations.length > 0) {
          const gridOptions = {
            columnDefs: columnDefs,
            rowData: integrations,
            defaultColDef: {
              sortable: true,
              filter: true,
              resizable: true,
              minWidth: 160,
              flex: 1,
            },
            components: {
              booleanRenderer: booleanRenderer
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
          
          if (typeof agGrid.createGrid === 'function') {
            console.log('Using agGrid.createGrid');
            agGrid.createGrid(gridDiv, gridOptions);
          } else if (typeof agGrid.Grid === 'function') {
            console.log('Using new agGrid.Grid');
            new agGrid.Grid(gridDiv, gridOptions);
          } else {
            console.error('ag-grid API not found');
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize ag-grid:', error);
    }
  }
});
