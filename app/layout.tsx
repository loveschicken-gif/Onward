import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onvard",
  description:
    "Onvard helps people search better and move forward by turning one idea into a more structured search path.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <footer className="global-legal-footer" aria-label="Legal disclaimer">
          <p>
            Onvard provides general job-search information and search tools only. It does not provide
            legal advice or determine immigration, licensing, or work-authorization eligibility.
          </p>
        </footer>
      </body>
    </html>
  );
}
