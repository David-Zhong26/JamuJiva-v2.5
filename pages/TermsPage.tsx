import React, { useMemo } from 'react';
import termsContent from '../content/terms-of-use.json';

type TermBlock = {
  style: string | null;
  bold: boolean;
  caps: boolean;
  title: string | null;
  text: string;
  full: string;
};

type SectionNav = {
  id: string;
  label: string;
  index: number;
};

const blocks = termsContent as TermBlock[];

const renderInline = (text: string, keyPrefix: string) => {
  const parts = text.split(/(https?:\/\/[^\s)]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g);

  return parts.map((part, index) => {
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

const isShortSectionHeading = (block: TermBlock) =>
  block.style === 'Legal2L1' &&
  !block.title &&
  block.text.length < 80 &&
  !/^[^.]+\.\s+[A-Z]/.test(block.text);

const splitL1Paragraph = (text: string) => {
  const match = text.match(/^([A-Za-z0-9][^.]{0,80}?\.)\s+([\s\S]+)$/);
  if (!match) return null;
  return { title: match[1], body: match[2] };
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const getSectionLabel = (block: TermBlock): string | null => {
  if (block.style !== 'Legal2L1') return null;

  if (isShortSectionHeading(block)) return block.text;

  const split = splitL1Paragraph(block.text);
  if (split) return split.title.replace(/\.$/, '');

  return block.text;
};

const NAV_SECTION_IDS = new Set([
  'access-to-the-site',
  'disclaimers',
  'limitation-on-liability',
  'term-and-termination',
  'general',
]);

const getSections = (bodyBlocks: TermBlock[]): SectionNav[] =>
  bodyBlocks.flatMap((block, index) => {
    const label = getSectionLabel(block);
    if (!label) return [];

    const baseId = slugify(label);
    return [{ id: baseId, label, index }];
  });

const TableOfContents: React.FC<{ sections: SectionNav[]; className?: string }> = ({
  sections,
  className = '',
}) => (
  <nav aria-label="Table of contents" className={className}>
    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2D4F3E]/60">
      Contents
    </p>
    <ul className="space-y-2.5 border-l border-[#2D4F3E]/15 pl-4">
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="block text-[13px] leading-snug text-[#2D4F3E]/75 transition-colors hover:text-[#2D4F3E]"
          >
            {section.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const TermsPage: React.FC = () => {
  const headerTitle = blocks[0]?.text ?? 'Terms of Use';
  const headerDate = blocks[1]?.text ?? '';
  const bodyBlocks = blocks.slice(2);

  const sections = useMemo(() => getSections(bodyBlocks), [bodyBlocks]);
  const navSections = useMemo(
    () => sections.filter((section) => NAV_SECTION_IDS.has(section.id)),
    [sections],
  );
  const sectionByIndex = useMemo(
    () => new Map(sections.map((section) => [section.index, section])),
    [sections],
  );

  return (
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
              <label htmlFor="terms-section-nav" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#2D4F3E]/60">
                Jump to section
              </label>
              <select
                id="terms-section-nav"
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
                    {section.label}
                  </option>
                ))}
              </select>
            </div>

            <header className="mb-8 text-center lg:text-left">
              <h1 className="text-lg font-bold text-[#2D4F3E] md:text-xl">{headerTitle}</h1>
              <p className="mt-1 text-sm font-bold text-[#2D4F3E]">{headerDate}</p>
            </header>

            <div className="space-y-4 text-[13px] leading-[1.65] text-[#2D4F3E] md:text-[14px]">
              {bodyBlocks.map((block, index) => {
                const key = `term-${index}`;
                const sectionId = sectionByIndex.get(index)?.id;

                if (block.style === null && block.bold && block.caps) {
                  return (
                    <p key={key} className="font-bold uppercase">
                      {renderInline(block.text, key)}
                    </p>
                  );
                }

                if (block.style === null && block.bold) {
                  return (
                    <p key={key} className="font-bold">
                      {renderInline(block.text, key)}
                    </p>
                  );
                }

                if (block.style === null && block.caps) {
                  return (
                    <p key={key} className="uppercase">
                      {renderInline(block.text, key)}
                    </p>
                  );
                }

                if (block.style === null) {
                  if (block.text === 'Address:') {
                    return (
                      <p key={key} className="pt-2 font-bold">
                        {block.text}
                      </p>
                    );
                  }

                  return (
                    <p key={key} className={block.text.startsWith('Email:') ? '' : 'pl-0'}>
                      {renderInline(block.text, key)}
                    </p>
                  );
                }

                if (isShortSectionHeading(block)) {
                  return (
                    <h2
                      key={key}
                      id={sectionId}
                      className={`pt-2 text-sm font-bold text-[#2D4F3E] md:text-[14px]${sectionId ? ' scroll-mt-28' : ''}`}
                    >
                      {block.text}
                    </h2>
                  );
                }

                if (block.style === 'Legal2L1') {
                  const split = splitL1Paragraph(block.text);
                  if (split) {
                    return (
                      <p key={key} id={sectionId} className={`pt-2${sectionId ? ' scroll-mt-28' : ''}`}>
                        <span className="font-bold">{split.title} </span>
                        <span className="font-normal">{renderInline(split.body, key)}</span>
                      </p>
                    );
                  }
                }

                if (block.style === 'Legal2L2' || block.style === 'Legal2L3') {
                  const indent = block.style === 'Legal2L3' ? 'pl-6 md:pl-8' : '';

                  if (block.title) {
                    return (
                      <p key={key} className={indent}>
                        <span className="font-bold">{block.title} </span>
                        <span className="font-normal">{renderInline(block.text, key)}</span>
                      </p>
                    );
                  }

                  if (block.text === 'Contact Information:') {
                    return (
                      <p key={key} className="pt-4 font-bold">
                        {block.text}
                      </p>
                    );
                  }

                  return (
                    <p key={key} className={`${indent} ${block.bold ? 'font-bold' : ''}`}>
                      {renderInline(block.text, key)}
                    </p>
                  );
                }

                return (
                  <p key={key} className="font-bold">
                    {renderInline(block.text, key)}
                  </p>
                );
              })}
            </div>
          </article>
        </div>
      </div>
    </main>
  );
};

export default TermsPage;
