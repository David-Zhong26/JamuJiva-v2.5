import React, { FormEvent, useEffect, useState } from 'react';

type AdminEvent = {
  id: string;
  date: string;
  title: string;
  location: string;
  time: string;
  endsAt: string;
  summary: string;
};

const SESSION_KEY = 'jj-events-admin';

const emptyForm = {
  title: '',
  date: '',
  location: '',
  time: '',
  endsAt: '',
  summary: '',
};

const EventsAdminPage: React.FC = () => {
  const [password, setPassword] = useState(() => sessionStorage.getItem(SESSION_KEY) || '');
  const [authed, setAuthed] = useState(Boolean(sessionStorage.getItem(SESSION_KEY)));
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loadEvents = async (token: string) => {
    const res = await fetch('/api/events/admin', {
      headers: { 'x-events-admin': token },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load events.');
    }
    setEvents(data.events || []);
  };

  useEffect(() => {
    if (!authed || !password) return;
    loadEvents(password).catch((err: Error) => {
      setError(err.message);
      setAuthed(false);
      sessionStorage.removeItem(SESSION_KEY);
    });
  }, [authed, password]);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/events/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');
      sessionStorage.setItem(SESSION_KEY, password);
      setAuthed(true);
      await loadEvents(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const endsAt = form.endsAt ? new Date(form.endsAt).toISOString() : '';
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-events-admin': password,
        },
        body: JSON.stringify({
          title: form.title,
          date: form.date,
          location: form.location,
          time: form.time,
          endsAt,
          summary: form.summary,
          details: form.summary ? [form.summary] : [],
          expectations: [
            { title: 'Come through', description: 'Meet the Jiva team.' },
            { title: 'Taste', description: 'Sample our signature drinks.' },
            { title: 'Connect', description: 'Local energy and good vibes.' },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create event.');
      setForm(emptyForm);
      await loadEvents(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create event.');
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm(`Delete event “${id}”?`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'x-events-admin': password },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not delete event.');
      await loadEvents(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete event.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="jj-min-screen bg-[#F6F1E8] px-5 pb-16 pt-28 text-[#3A1A10] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl">Events Admin</h1>
        <p className="mt-2 text-sm text-[#3A1A10]/75">
          Add or delete events without editing code. Events automatically disappear from the site
          after their end date/time.
        </p>

        {error && (
          <p className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        {!authed ? (
          <form onSubmit={onLogin} className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <label className="block text-sm font-semibold">
              Admin password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#3A1A10]/20 px-3 py-2"
                required
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-[#8C3F1F] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white disabled:opacity-60"
            >
              Log in
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-10">
            <form onSubmit={onCreate} className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Add event</h2>
              {(
                [
                  ['title', 'Title', 'text'],
                  ['date', 'Date label (e.g. AUG 11)', 'text'],
                  ['location', 'Location', 'text'],
                  ['time', 'Time label (e.g. 1:00PM - 5:00PM)', 'text'],
                  ['endsAt', 'Ends at (local datetime)', 'datetime-local'],
                  ['summary', 'Short summary', 'text'],
                ] as const
              ).map(([key, label, type]) => (
                <label key={key} className="block text-sm font-semibold">
                  {label}
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-[#3A1A10]/20 px-3 py-2 font-normal"
                    required={key === 'title' || key === 'endsAt'}
                  />
                </label>
              ))}
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-[#8C3F1F] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white disabled:opacity-60"
              >
                Add event
              </button>
            </form>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">All events</h2>
              <ul className="mt-4 divide-y divide-[#3A1A10]/10">
                {events.length === 0 ? (
                  <li className="py-3 text-sm text-[#3A1A10]/70">No events in the database yet.</li>
                ) : (
                  events.map((event) => {
                    const past = new Date(event.endsAt).getTime() <= Date.now();
                    return (
                      <li key={event.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold">
                            {event.title}{' '}
                            {past && (
                              <span className="text-xs font-bold uppercase text-[#8C3F1F]/70">
                                (hidden / past)
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-[#3A1A10]/70">
                            {event.date} · {event.time} · {event.location}
                          </p>
                          <p className="text-xs text-[#3A1A10]/55">Ends: {event.endsAt}</p>
                        </div>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onDelete(event.id)}
                          className="w-fit rounded-lg border border-red-300 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-700 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

export default EventsAdminPage;
