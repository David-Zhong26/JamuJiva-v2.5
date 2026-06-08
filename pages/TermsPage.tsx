import React from 'react';
import termsContent from '../content/terms-of-use.json';

type TermBlock = {
  style: string | null;
  bold: boolean;
  caps: boolean;
  title: string | null;
  text: string;
  full: string;
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

const TermsPage: React.FC = () => {
  const headerTitle = blocks[0]?.text ?? 'Terms of Use';
  const headerDate = blocks[1]?.text ?? '';
  const bodyBlocks = blocks.slice(2);

  return (
    <main className="bg-[#F5E8CA] pt-24 pb-16 md:pt-32 md:pb-24">
      <article className="mx-auto max-w-5xl px-8 md:px-16 lg:px-24">
        <header className="mb-12 text-center md:mb-16">
          <h1 className="font-serif text-4xl font-black text-[#2D4F3E] md:text-5xl lg:text-6xl">
            {headerTitle}
          </h1>
          <p className="mt-4 text-sm text-[#2D4F3E]/70 md:text-base">{headerDate}</p>
        </header>

        <div className="space-y-4 text-sm leading-[1.7] text-[#2D4F3E] md:text-[15px]">
          {bodyBlocks.map((block, index) => {
            const key = `term-${index}`;

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
              return <p key={key}>{renderInline(block.text, key)}</p>;
            }

            if (isShortSectionHeading(block)) {
              return (
                <h2
                  key={key}
                  className="pt-6 font-serif text-xl font-bold text-[#2D4F3E] md:text-2xl"
                >
                  {block.text}
                </h2>
              );
            }

            if (block.style === 'Legal2L1') {
              const split = splitL1Paragraph(block.text);
              if (split) {
                return (
                  <div key={key} className="pt-6">
                    <h2 className="font-serif text-xl font-bold text-[#2D4F3E] md:text-2xl">
                      {split.title}
                    </h2>
                    <p className="mt-4">{renderInline(split.body, key)}</p>
                  </div>
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

              if (block.text === 'Contact Us' || block.text === 'Contact Information:') {
                return (
                  <div key={key} className="pt-6">
                    <h2 className="mb-4 font-serif text-xl font-bold text-[#2D4F3E] md:text-2xl">
                      Contact Us
                    </h2>
                    <p>
                      {renderInline(
                        'If you have any questions regarding these Terms or the practices of this Site, please contact us by sending an email to jamujiva@gmail.com.',
                        key,
                      )}
                    </p>
                  </div>
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
    </main>
  );
};

export default TermsPage;
