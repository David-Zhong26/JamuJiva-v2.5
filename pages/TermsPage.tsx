import React from 'react';
import termsText from '../content/terms-of-use.txt?raw';

const URL_PATTERN = /(https?:\/\/[^\s)]+)/g;

const renderParagraph = (text: string, key: string) => {
  const parts = text.split(URL_PATTERN);

  return (
    <p key={key} className="mb-4 leading-relaxed">
      {parts.map((part, index) =>
        /^https?:\/\//.test(part) ? (
          <a
            key={`${key}-${index}`}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-[#2D4F3E] underline decoration-[#F47C3E]/60 underline-offset-2 hover:text-[#F47C3E]"
          >
            {part}
          </a>
        ) : (
          <React.Fragment key={`${key}-${index}`}>{part}</React.Fragment>
        )
      )}
    </p>
  );
};

const SECTION_HEADINGS = new Set([
  'Accounts',
  'Access to the Site',
  'Third-Party Links & Ads; Other Users',
  'Disclaimers',
  'Limitation on Liability',
  'General',
]);

const isSectionHeading = (line: string) => SECTION_HEADINGS.has(line.trim());

const isAllCapsBlock = (line: string) =>
  line.length > 80 && line === line.toUpperCase() && /[A-Z]/.test(line);

const TermsPage: React.FC = () => {
  const blocks = termsText
    .replace(/\r/g, '')
    .split('\n\n')
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <main className="bg-[#F5E8CA] pt-24 pb-16 md:pt-32 md:pb-24">
      <article className="mx-auto max-w-3xl px-5 md:px-12">
        <header className="mb-10 border-b border-[#2D4F3E]/10 pb-8">
          <h1 className="font-serif text-3xl font-black text-[#2D4F3E] sm:text-4xl md:text-5xl">
            Website Terms of Use
          </h1>
          <p className="mt-3 text-sm font-bold uppercase tracking-widest text-[#2D4F3E]/60">
            Version 1.0 · Last revised June 8, 2026
          </p>
        </header>

        <div className="text-[#2D4F3E]/90 text-sm leading-relaxed md:text-base">
          {blocks.map((block, index) => {
            const firstLine = block.split('\n')[0]?.trim() ?? block;

            if (index === 0) {
              return null;
            }

            if (index <= 2 && (firstLine.startsWith('Version') || firstLine.startsWith('Last revised'))) {
              return null;
            }

            if (isSectionHeading(firstLine) && block === firstLine) {
              return (
                <h2
                  key={index}
                  className="mb-4 mt-10 font-serif text-xl font-black text-[#2D4F3E] first:mt-0 md:text-2xl"
                >
                  {firstLine}
                </h2>
              );
            }

            if (isAllCapsBlock(block)) {
              return (
                <p
                  key={index}
                  className="mb-4 rounded-xl border border-[#2D4F3E]/10 bg-[#F5F2ED]/60 p-4 text-xs font-bold uppercase leading-relaxed tracking-wide text-[#2D4F3E] md:text-sm"
                >
                  {block}
                </p>
              );
            }

            if (firstLine.startsWith('Contact Information:')) {
              return (
                <div key={index} className="mt-10 border-t border-[#2D4F3E]/10 pt-8">
                  <h2 className="mb-4 font-serif text-xl font-black text-[#2D4F3E] md:text-2xl">
                    Contact Information
                  </h2>
                  <div className="space-y-1 whitespace-pre-line text-[#2D4F3E]/85">
                    {block.replace('Contact Information:', '').trim()}
                  </div>
                </div>
              );
            }

            return renderParagraph(block, String(index));
          })}
        </div>
      </article>
    </main>
  );
};

export default TermsPage;
