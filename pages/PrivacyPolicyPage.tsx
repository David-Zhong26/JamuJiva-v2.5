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

const { title, lastUpdated, intro, sections } = privacyContent as {
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: PrivacySection[];
};

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

const PrivacyPolicyPage: React.FC = () => (
  <main className="bg-[#F5E8CA] pt-24 pb-16 md:pt-32 md:pb-24">
    <article className="mx-auto max-w-5xl px-8 md:px-16 lg:px-24">
      <header className="mb-12 text-center md:mb-16">
        <h1 className="font-serif text-4xl font-black text-[#2D4F3E] md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-4 text-sm text-[#2D4F3E]/70 md:text-base">{lastUpdated}</p>
      </header>

      <div className="space-y-10 text-sm leading-[1.7] text-[#2D4F3E] md:text-[15px]">
        {intro ? <p>{renderInline(intro, 'intro')}</p> : null}
        {sections.map((section) => (
          <section key={section.id}>
            <h2 className="mb-4 font-serif text-xl font-bold text-[#2D4F3E] md:text-2xl">
              {section.title}
            </h2>
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

                return <p key={key}>{renderInline(block.text, key)}</p>;
              })}
            </div>
          </section>
        ))}
      </div>
    </article>
  </main>
);

export default PrivacyPolicyPage;
