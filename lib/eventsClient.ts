import { EVENTS, EventItem, getEventById, getVisibleEvents, isEventVisible } from '../constants/events';

function normalizeEvent(event: EventItem, local?: EventItem): EventItem {
  return {
    ...event,
    image: event.image || local?.image || '',
    details: event.details ?? local?.details ?? [],
    expectations: event.expectations ?? local?.expectations ?? [],
    summary: event.summary || local?.summary || '',
    time: event.time || local?.time || '',
    capacity: event.capacity || local?.capacity || '',
    priceLabel: event.priceLabel || local?.priceLabel || '',
  };
}

/** Merge remote + local by id so catalog constants stay available if the API is sparse. */
function mergeEvents(remote: EventItem[], includePast: boolean): EventItem[] {
  const byId = new Map<string, EventItem>();

  for (const local of EVENTS) {
    byId.set(local.id, local);
  }
  for (const remoteEvent of remote) {
    const local = byId.get(remoteEvent.id);
    byId.set(remoteEvent.id, normalizeEvent(remoteEvent, local));
  }

  const all = Array.from(byId.values());
  if (includePast) {
    return all.sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
  }
  return getVisibleEvents(all);
}

async function fetchRemoteEvents(includePast: boolean): Promise<EventItem[] | null> {
  try {
    const qs = includePast ? '?includePast=1' : '';
    const res = await fetch(`/api/events${qs}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data.events)) return null;
    return data.events as EventItem[];
  } catch {
    return null;
  }
}

/** Upcoming / still-active events for public listings. */
export async function fetchVisibleEvents(): Promise<EventItem[]> {
  const remote = await fetchRemoteEvents(false);
  if (!remote) return getVisibleEvents(EVENTS);
  return mergeEvents(remote, false);
}

/** Full catalog (upcoming + past) for “See all events”. */
export async function fetchAllEvents(): Promise<EventItem[]> {
  const remote = await fetchRemoteEvents(true);
  if (!remote) {
    return [...EVENTS].sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
  }
  return mergeEvents(remote, true);
}

export async function fetchEventById(eventId: string): Promise<EventItem | null> {
  const local = getEventById(eventId);
  const remote = await fetchRemoteEvents(true);
  if (!remote) {
    return local && isEventVisible(local) ? local : null;
  }

  const merged = mergeEvents(remote, true);
  const found = merged.find((item) => item.id === eventId);
  if (!found) return null;
  // Detail pages stay available for any event in the full catalog.
  return found;
}
