import borobudurOffering from '../materials/journal-borobudur-offering.jpg';
import riceFields from '../materials/journal-rice-fields.jpg';
import borobudurWall from '../materials/journal-borobudur-wall.jpg';
import jamuStall from '../materials/journal-jamu-stall.jpg';

export type JournalBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'image'; src: string; alt: string }
  | { type: 'signoff'; lines: string[] }
  | { type: 'footnotes'; items: Array<{ id: string; text: string }> };

export type JournalArticle = {
  slug: string;
  number: string;
  title: string;
  excerpt: string;
  cover: string;
  coverAlt: string;
  blocks: JournalBlock[];
};

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    slug: 'before-wellness-there-was-jamu',
    number: '01',
    title: 'Before Wellness, There Was Jamu',
    excerpt: 'Before wellness had matcha lattes, Pilates classes, and morning routines, Indonesia had jamu.',
    cover: riceFields,
    coverAlt: 'Rice terraces and palm trees in morning light in Indonesia',
    blocks: [
      {
        type: 'paragraph',
        text: 'Before wellness had matcha lattes, Pilates classes, and morning routines, Indonesia had jamu.',
      },
      {
        type: 'paragraph',
        text: 'In the early mornings of Java, a woman walks through the market with a basket of glass bottles strapped to her back. She’s a jamu gendong, carrying freshly made herbal elixirs from one neighborhood to the next. Inside contains turmeric, ginger, tamarind, roots, leaves, flowers — ingredients that have been gathered, boiled, and passed through generations.',
      },
      {
        type: 'paragraph',
        text: "At this moment, she isn't selling a trend. She's carrying something people have trusted for centuries.",
      },
      {
        type: 'paragraph',
        text: 'While this scene may feel familiar to Indonesians, jamu is new to many elsewhere in the world. But for generations, it has simply been a part of everyday life, long before it ever needed a wellness label.',
      },
      { type: 'heading', text: 'A tradition older than we can remember' },
      {
        type: 'paragraph',
        text: 'The word jamu traces back to Javanese, combining jawa ("Java" or "Javanese") with ngramu ("to mix," "to gather the ingredients"). Together, these two words capture the essence of jamu: a blend of ingredients deeply rooted in the land, people, and traditions of Java.',
      },
      {
        type: 'image',
        src: borobudurOffering,
        alt: 'Stone relief at Borobudur of a woman offering a vessel to two seated figures',
      },
      {
        type: 'image',
        src: borobudurWall,
        alt: 'Ancient stone reliefs carved across the walls of Borobudur',
      },
      {
        type: 'paragraph',
        text: 'Carvings from Borobudur dating back to the 8th and 9th centuries show people gathering and preparing herbs, a glimpse into healing traditions in Indonesia that go back over a millennium.¹ Once associated with the royal courts of Java and traditional care for kings and queens, jamu eventually made its way beyond the palace walls through the jamu gendong — women who carried freshly made herbal drinks from house to house and market to market.',
      },
      {
        type: 'paragraph',
        text: 'By the hands of jamu gendongs, jamu found its way to become a part of everyday Indonesian life. A bottle of jamu could be shared with everyone, transcending generations, neighborhoods, and social backgrounds. Jamu was not only a wellness routine, but a way to connect to the community around you. Sharing a cup of jamu together, people would laugh, chit chat about their day and relieve their troubles as they sip the comforting taste of jamu.',
      },
      {
        type: 'image',
        src: jamuStall,
        alt: 'Mbok Abu at her jamu stall in Sukoharjo, with stacked woven baskets behind her',
      },
      {
        type: 'paragraph',
        text: 'Above is a picture of Mbok Abu, who has been in the jamu trade since she was a little girl, learning recipes passed down from her mother and grandmother. She has worked as a jamu gendong in Jakarta for 20 years before returning to Sukoharjo to set up her stall.',
      },
      {
        type: 'paragraph',
        text: 'This beloved tradition is recognized by UNESCO in 2023 as an Intangible Cultural Heritage of Humanity, honoring not only the drinks, but the knowledge, traditions, and communities that keep them alive.²',
      },
      { type: 'paragraph', text: 'Now, that story is crossing the Pacific.' },
      { type: 'heading', text: 'Our mission with Jiva' },
      {
        type: 'paragraph',
        text: 'Our goal with Jiva is to not reinvent jamu, but to make it easier for a new generation to discover, enjoy, and fit into modern routines.',
      },
      {
        type: 'paragraph',
        text: 'We asked ourselves: What would it look like if more people could experience jamu the way we do?',
      },
      {
        type: 'paragraph',
        text: "Our first blend, Golden Glow, is our take on a classic Indonesian flavor profile: turmeric, tamarind, lime, and a touch of salt. It's inspired by the jamu we know, but made for the way we live now. Whether that's a morning on the go, a post-workout sip, or a moment to slow down in the middle of a busy day. Bright and refreshing, it's made to fit naturally into your day while supporting digestion.",
      },
      { type: 'paragraph', text: 'While staying true to its roots, the ritual evolves.' },
      {
        type: 'paragraph',
        text: 'Jiva takes something that has been passed down for generations and gives it room to travel; from Indonesian kitchens and neighborhood streets to modern wellness communities across the world.',
      },
      {
        type: 'paragraph',
        text: "Because we believe the best traditions don’t need to be replaced. They just need to be shared.",
      },
      {
        type: 'paragraph',
        text: "And that's what we hope to do with Jiva: share a little piece of Indonesia with you, one can at a time.",
      },
      {
        type: 'paragraph',
        text: 'This is the Jiva Journal — a place to explore the ingredients, people, rituals, and stories behind jamu, and the journey of bringing them from Indonesia to the world.',
      },
      {
        type: 'paragraph',
        text: 'So, wherever you are, take a moment, pour yourself a sip, and join us.',
      },
      { type: 'paragraph', text: 'A tradition worth pausing for.' },
      { type: 'paragraph', text: 'To drink the life you deserve.' },
      { type: 'signoff', lines: ['#JamuJiva', '— Jiva Team'] },
      {
        type: 'footnotes',
        items: [
          {
            id: 'note-1',
            text: 'The Karmawibhangga reliefs at Borobudur, an 8th–9th century Buddhist temple in Central Java, include panels depicting herb-gathering, pounding, and healing scenes — among the earliest physical evidence of jamu-related practices in Java. Source: Google Arts & Culture, "The Origin of Jamu," Indonesia Gastronomy Network.',
          },
          {
            id: 'note-2',
            text: "Jamu Wellness Culture was officially inscribed on UNESCO's Representative List of the Intangible Cultural Heritage of Humanity on December 6, 2023, during the 18th session of the Intergovernmental Committee for the Safeguarding of Intangible Cultural Heritage in Kasane, Botswana — the 13th Indonesian tradition to receive this recognition. Source: UNESCO Intangible Cultural Heritage Sector; Tempo.co.",
          },
        ],
      },
    ],
  },
];

export function journalArticleBySlug(slug: string) {
  return JOURNAL_ARTICLES.find((article) => article.slug === slug);
}
