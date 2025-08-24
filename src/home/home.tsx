import { Layout } from "../layout.js";
import { IntegrationConnectionConfiguration } from "../data-source/google/types.js";

interface HomepageProps {
  integrations: IntegrationConnectionConfiguration[];
}


export function Homepage({ integrations }: HomepageProps) {
  return <Layout>
      <div id="data-grid" class="ag-theme-quartz" style="height: 100vh; width: 100%;"
           data-integrations={JSON.stringify(integrations)}
           >
      </div>
      {integrations.length === 0 && (
        <p>No integrations available at the moment.</p>
      )}
  </Layout>
}