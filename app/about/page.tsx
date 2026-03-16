import Link from "next/link";
import PageBackButton from "@/components/PageBackButton";
import { aboutContent, aboutMetadata } from "@/content/about";

export const metadata = aboutMetadata;

export default function AboutPage() {
  return (
    <main className="page">
      <header className="hero">
        <h1 className="hero-title">{aboutContent.productName}</h1>
        <p className="hero-support">
          <PageBackButton label="← Back to previous page" />
        </p>
      </header>

      <section className="about-page" aria-label="About Onvard">
        <h2 className="about-title">{aboutContent.heading}</h2>
        <div className="about-body">
          {aboutContent.paragraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
          <p>
            {aboutContent.feedback.label}{" "}
            <a
              href={aboutContent.feedback.url}
              target="_blank"
              rel="noreferrer"
            >
              {aboutContent.feedback.url}
            </a>
          </p>
          <p className="about-note">
            {aboutContent.note}
          </p>
        </div>
      </section>

      <footer className="footer" aria-label="Credits">
        <p className="footer-credits">
          {aboutContent.contributorsLabel}
        </p>
        <p className="footer-tagline">
          <Link href="/" className="footer-link">
            {aboutContent.productName}
          </Link>
          {aboutContent.footerTaglineSuffix}
        </p>
      </footer>
    </main>
  );
}
