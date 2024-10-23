'use client';

import './globals.css';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../utils/i18n';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={i18n.language}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <I18nextProvider i18n={i18n}>
          <main>{children}</main>
        </I18nextProvider>
      </body>
    </html>
  );
}
