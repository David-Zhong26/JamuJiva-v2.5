import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { journalArticleBySlug, type JournalBlock } from '../constants/journal';

function RichText({ text }: { text: string }) {
  const parts = text.split(/([¹²])/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part === '¹' || part === '²') {
          const id = part === '¹' ? 'note-1' : 'note-2';
          return (
            <sup key={`${part}-${index}`}>
              <a href={`#${id}`} className="font-semibold text-[#8C3F1F]">
                {part === '¹' ? '1' : '2'}
              </a>
            </sup>
          );
        }
        return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
      })}
    </>
  );
}

function ArticleBlock({ block }: { block: JournalBlock }) {
  if (block.type === 'image') {
    return (
      <img
        src={block.src}
        alt={block.alt}
        className="w-full rounded-[1.5rem]"
        decoding="async"
      />
    );
  }
  if (block.type === 'heading') {
    return <h2 className="pt-4 font-serif text-3xl leading-tight text-[#6F2E1E] md:text-4xl">{block.text}</h2>;
  }
  if (block.type === 'signoff') {
    return (
      <div className="pt-2 text-sm leading-relaxed text-[#6F2E1E]">
        {block.lines.map((line) => (
          <p key={line} className="font-semibold">
            {line}
          </p>
        ))}
      </div>
    );
  }
  if (block.type === 'footnotes') {
    return (
      <section className="border-t border-[#8C3F1F]/15 pt-6">
        <h2 className="text-xs font-black uppercase tracking-[0.18em] text-[#8C3F1F]/70">Footnotes</h2>
        <ol className="mt-4 space-y-4">
          {block.items.map((item, index) => (
            <li id={item.id} key={item.id} className="text-sm leading-relaxed text-[#6F2E1E]/75">
              <span className="font-semibold text-[#8C3F1F]">{index + 1}. </span>
              {item.text}
            </li>
          ))}
        </ol>
      </section>
    );
  }
  return <p className="text-base leading-relaxed text-[#6F2E1E]/90 md:text-lg md:leading-relaxed"><RichText text={block.text} /></p>;
}

const JournalArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? journalArticleBySlug(slug) : undefined;
  if (!article) return <Navigate to="/journal" replace />;

  return (
    <main className="bg-[#F6F1E8] px-4 pb-20 pt-28 sm:px-6 md:px-8 md:pb-24 md:pt-36">
      <article className="mx-auto max-w-3xl">
        <Link to="/journal" className="text-xs font-black uppercase tracking-[0.18em] text-[#8C3F1F] hover:text-[#F47C3E]">
          The Jiva Journal
        </Link>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[#8C3F1F]/65">{article.number}</p>
        <h1 className="mt-3 font-serif text-[1.4rem] leading-tight text-[#6F2E1E] sm:text-4xl md:text-[2.65rem]">{article.title}</h1>
        <img
          src={article.cover}
          alt={article.coverAlt}
          className="mt-8 w-full rounded-[1.5rem] object-cover"
          decoding="async"
        />
        <div className="mt-10 space-y-5">
          {article.blocks.map((block, index) => (
            <ArticleBlock key={`${block.type}-${index}`} block={block} />
          ))}
        </div>
      </article>
    </main>
  );
};

export default JournalArticlePage;
