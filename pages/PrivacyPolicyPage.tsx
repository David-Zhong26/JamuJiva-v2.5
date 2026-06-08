import React from 'react';
import { Link } from 'react-router-dom';
import privacyContent from '../content/privacy-policy.json';

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

type PrivacySection = {
  id: string;
  title: string;
  inNav?: boolean;
  blocks: ContentBlock[];
};

const { title, lastUpdated, sections } = privacyContent as {
  title: string;
  lastUpdated: string;
  sections: PrivacySection[];
};

const navSections = sections.filter((section) => section.inNav);

const renderInline = (text: string, keyPrefix: string) => {
  const parts = text.split(/(https?:\/\/[^\s)]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g);

  return parts.map((part, index) => {
    if (/^https?:\/\/[^\s]*jivalivin\.com\/terms(?:-of-use)?/.test(part)) {
      return (
        <Link
          key={`${keyPrefix}-${index}`}
          to="/terms"
          className="underline underline-offset-2"
        >
          {part}
        </Link>
      );
    }

    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={`${keyPrefix}-${index}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all underline underline-offset-2"
        >
          {part}
        </a>
      );
    }

    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(part)) {
      return (
        <a key={`${keyPrefix}-${index}`} href={`mailto:${part}`} className="underline underline-offset-2">
          {part}
        </a>
      );
    }

    return <React.Fragment key={`${keyPrefix}-${index}`}>{part}</React.Fragment>;
  });
};

const TableOfContents: React.FC<{ sections: PrivacySection[] }> = ({ sections: navSections }) => (
  <nav aria-label="Table of contents">
    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2D4F3E]/60">
      Contents
    </p>
    <ul className="space-y-2.5 border-l border-[#2D4F3E]/15 pl-4">
      {navSections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="block text-[13px] leading-snug text-[#2D4F3E]/75 transition-colors hover:text-[#2D4F3E]"
          >
            {section.title}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const PrivacyPolicyPage: React.FC = () => (
  <main className="bg-[#F5E8CA] pt-24 pb-16 md:pt-32 md:pb-24">
    <div className="mx-auto max-w-6xl px-5 md:px-8 lg:px-10">
      <div className="lg:grid lg:grid-cols-[220px_minmax(0,680px)] lg:justify-center lg:gap-12 xl:grid-cols-[240px_minmax(0,680px)] xl:gap-16">
        <aside className="hidden lg:block">
          <div className="sticky top-28 pt-2">
            <TableOfContents sections={navSections} />
          </div>
        </aside>

        <article className="min-w-0">
          <div className="mb-6 lg:hidden">
            <label
              htmlFor="privacy-section-nav"
              className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#2D4F3E]/60"
            >
              Jump to section
            </label>
            <select
              id="privacy-section-nav"
              className="w-full rounded-md border border-[#2D4F3E]/20 bg-[#F5E8CA] px-3 py-2 text-sm text-[#2D4F3E] outline-none focus:border-[#2D4F3E]/40"
              defaultValue=""
              onChange={(event) => {
                const value = event.target.value;
                if (!value) return;
                document.getElementById(value)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                event.target.value = '';
              }}
            >
              <option value="" disabled>
                Select a section
              </option>
              {navSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.title}
                </option>
              ))}
            </select>
          </div>

          <header className="mb-8 text-center lg:text-left">
            <h1 className="text-lg font-bold text-[#2D4F3E] md:text-xl">{title}</h1>
            <p className="mt-1 text-sm font-bold text-[#2D4F3E]">{lastUpdated}</p>
          </header>

          <div className="space-y-8 text-[13px] leading-[1.65] text-[#2D4F3E] md:text-[14px]">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="mb-3 text-sm font-bold text-[#2D4F3E] md:text-[14px]">{section.title}</h2>
                <div className="space-y-4">
                  {section.blocks.map((block, index) => {
                    const key = `${section.id}-${index}`;

                    if (block.type === 'list') {
                      return (
                        <ul key={key} className="list-disc space-y-2 pl-5">
                          {block.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      );
                    }

                    return (
                      <p key={key}>{renderInline(block.text, key)}</p>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  </main>
);

export default PrivacyPolicyPage;
