import { PropsWithChildren } from '@triptease/html-jsx';

export interface LayoutProps {
  title?: string;
}

export function Layout({ title, children }: PropsWithChildren<LayoutProps>) {
  return (
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
      />
      <title>{title ? 'Campaign Manager › ' + title : 'Campaign Manager'}</title>
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="https://cdn.design-system.triptease.io/triptease.css" crossorigin="anonymous" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ag-grid-community@34.1.2/styles/ag-theme-quartz.css" />
      <script src="https://cdn.jsdelivr.net/npm/ag-grid-community@34.1.2/dist/ag-grid-community.min.js"></script>
      <script src="/ag-grid-init.js"></script>
    </head>
    <body hx-boost="true">
    <div id="app-container">
      <div id="global-error" role="alert" aria-live="assertive" class="warning">
        <div id="global-error-message" class="warning-content"></div>
      </div>
      {children}
    </div>
    </body>
    </html>
  );
}