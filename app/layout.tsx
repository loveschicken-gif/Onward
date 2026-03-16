import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onvard",
  description:
    "Onvard helps you uncover hidden job opportunities by building smarter Google string searches for company career pages.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
