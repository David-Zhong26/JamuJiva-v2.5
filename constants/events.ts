import beachHero from '../materials/events-bg-beach.png';
import eventGoldenHour from '../materials/event-golden-hour.png';
import eventPilates from '../materials/event-pilates.png';
import eventMotion from '../materials/event-motion.png';
import eventSunbathing from '../materials/event-sunbathing.png';

export type EventItem = {
  id: string;
  date: string;
  title: string;
  location: string;
  image: string;
  summary: string;
  details: string[];
  time: string;
  capacity: string;
  priceLabel: string;
  /** ISO datetime — event is hidden after this moment (end of event / day). */
  endsAt: string;
  expectations: Array<{
    title: string;
    description: string;
  }>;
};

export const EVENTS: EventItem[] = [
  {
    id: 'melrose-farmers-market',
    date: 'AUG 6',
    title: 'Melrose Farmers Market',
    location: 'Melrose, MA',
    image: eventSunbathing,
    summary: 'Find Jiva at Melrose Farmers Market for an afternoon of fresh sips and local energy.',
    details: [
      'Stop by for a taste, meet the team, and stock up on golden glow and spiced ivory while you shop the market.',
      'Come say hi, grab a cold can, and take a little ritual into the rest of your week.',
    ],
    time: '2:30PM - 6:30PM',
    capacity: 'Open market',
    priceLabel: 'Free entry',
    endsAt: '2026-08-06T18:30:00-04:00',
    expectations: [
      { title: 'Market Pop-Up', description: 'Sip and shop on site.' },
      { title: 'Jiva Tastings', description: 'Try our signature drinks.' },
      { title: 'Local Vibes', description: 'Meet the makers and community.' },
    ],
  },
  {
    id: 'lowell-market',
    date: 'AUG 7',
    title: 'Lowell Farmers Market',
    location: 'Lowell, MA',
    image: eventGoldenHour,
    summary: 'We are pouring at Lowell Market — come through for a four-hour window of Jiva energy.',
    details: [
      'Swing by between 1 PM and 5 PM for cold cans, quick taste notes, and a warm hello from the team.',
      'Perfect for a Friday market stroll with friends, family, or a solo reset.',
    ],
    time: '1:00PM - 5:00PM',
    capacity: 'Open market',
    priceLabel: 'Free entry',
    endsAt: '2026-08-07T17:00:00-04:00',
    expectations: [
      { title: 'Afternoon Pour', description: 'Four hours of Jiva on site.' },
      { title: 'Taste & Take', description: 'Sample, then grab a can to go.' },
      { title: 'Community Stop', description: 'Chat wellness, rituals, and flavor.' },
    ],
  },
  {
    id: 'east-longmeadow-farmers-market',
    date: 'AUG 8',
    title: "East Longmeadow Farmers' Market",
    location: 'East Longmeadow, MA',
    image: eventPilates,
    summary: 'Morning market energy with Jiva — pending final booth details, still on the calendar.',
    details: [
      'Join us Saturday morning for fresh air, local goods, and a revitalizing sip to start the weekend.',
      'Status is pending confirmation; check back or email us if you plan to meet us there.',
    ],
    time: '9:00AM - 1:00PM',
    capacity: 'Open market',
    priceLabel: 'Free entry',
    endsAt: '2026-08-08T13:00:00-04:00',
    expectations: [
      { title: 'Pending Pop-Up', description: 'Booth confirmation in progress.' },
      { title: 'Morning Market', description: '9 AM to 1 PM window.' },
      { title: 'Weekend Reset', description: 'Light, bright, community-first.' },
    ],
  },
  {
    id: 'barre-groove-pop-up',
    date: 'AUG 11',
    title: 'Barre Groove Pop Up',
    location: 'Barre, MA',
    image: eventMotion,
    summary: 'An all-day barre groove pop-up — movement, music, and Jiva poured for the full day.',
    details: [
      'Spend the day with groove-forward energy: flow, connect, and fuel with Jiva whenever you need a lift.',
      'All-day presence means you can drop in on your own schedule and still catch the team.',
    ],
    time: 'All day',
    capacity: 'Open event',
    priceLabel: 'Free entry',
    endsAt: '2026-08-11T23:59:59-04:00',
    expectations: [
      { title: 'All-Day Pop-Up', description: 'Come anytime on Aug 11.' },
      { title: 'Barre Groove', description: 'Music-led movement energy.' },
      { title: 'Jiva On Site', description: 'Drinks to match the rhythm.' },
    ],
  },
];

/** Full-bleed page background for Events. */
export const EVENTS_HERO_IMAGE = beachHero;

/** Visible when `now` is still before the event end. */
export function isEventVisible(event: Pick<EventItem, 'endsAt'>, now: Date = new Date()): boolean {
  const ends = new Date(event.endsAt);
  if (Number.isNaN(ends.getTime())) return true;
  return ends.getTime() > now.getTime();
}

export function getVisibleEvents(events: EventItem[] = EVENTS, now: Date = new Date()): EventItem[] {
  return events
    .filter((event) => isEventVisible(event, now))
    .sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
}

export function getEventById(eventId: string, events: EventItem[] = EVENTS): EventItem | undefined {
  return events.find((item) => item.id === eventId);
}
