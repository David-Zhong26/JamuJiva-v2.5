import React from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'Does Jiva need to be refrigerated?',
    answer:
      'Yes. Jiva must be kept refrigerated. Place it in the refrigerator as soon as possible after delivery or pickup to maintain its freshness and quality.',
  },
  {
    question: 'How long does Jiva stay fresh?',
    answer:
      'Jiva is made fresh in small batches. Keep it refrigerated and enjoy it within 7 days of delivery or pickup. Natural separation may occur, so shake well before drinking.',
  },
  {
    question: 'Is Jiva a supplement or medicine?',
    answer:
      'No. Jiva is a beverage, not a dietary supplement or medicine. It is not intended to diagnose, treat, cure, or prevent any disease.',
  },
  {
    question: 'What inspired Jiva?',
    answer:
      'Jiva was inspired by jamu, Indonesia’s long-standing herbal wellness tradition, and by the belief behind our phrase, “Drink the life you deserve”, that everyday wellness should feel simple, enjoyable, and within reach. We created Jiva to bring culturally rooted flavors into a lighter, more refreshing drink made for modern routines.',
  },
] as const;

const FaqPage: React.FC = () => (
  <main className="bg-[#F5E8CA] px-5 pb-16 pt-24 md:px-12 md:pb-20 md:pt-32">
    <section className="mx-auto max-w-3xl">
      <h1 className="text-center font-serif text-4xl font-black text-[#2D4F3E] md:text-5xl">FAQ</h1>

      <div className="mt-10 space-y-4">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.question}
            className="group rounded-2xl border border-[#2D4F3E]/12 bg-white/35 px-5 py-4 text-[#2D4F3E]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl font-bold marker:content-none md:text-2xl">
              <span>{item.question}</span>
              <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <p className="pt-4 text-base leading-relaxed text-[#2D4F3E]/80 md:text-lg">{item.answer}</p>
          </details>
        ))}

        <p className="pt-4 text-sm leading-relaxed text-[#2D4F3E]/80 md:text-base">
          Still have questions? Email us at{' '}
          <a className="font-bold text-[#2D4F3E] underline underline-offset-4" href="mailto:support@jivalivin.com">
            support@jivalivin.com
          </a>
          . We&apos;d love to hear from you.
        </p>
      </div>
    </section>
  </main>
);

export default FaqPage;
