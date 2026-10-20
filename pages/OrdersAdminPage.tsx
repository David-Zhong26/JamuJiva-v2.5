import React, { FormEvent, useEffect, useState } from 'react';

type AdminOrder = {
  id: string;
  email: string | null;
  order_kind: string | null;
  payment_status: string;
  fulfillment_status: string | null;
  fulfillment_type: string | null;
  shipping_address: string | null;
  amount_total: number | null;
  currency: string;
  tracking_url: string | null;
  stripe_session_id: string;
  created_at: string;
};

type AddressRequest = {
  id: string;
  order_id: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
};

const SESSION_KEY = 'jj-orders-admin';
const FULFILLMENT = ['preparing', 'ready_for_pickup', 'shipped', 'delivered', 'picked_up'] as const;

const OrdersAdminPage: React.FC = () => {
  const [password, setPassword] = useState(() => sessionStorage.getItem(SESSION_KEY) || '');
  const [authed, setAuthed] = useState(Boolean(sessionStorage.getItem(SESSION_KEY)));
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [requests, setRequests] = useState<AddressRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async (token: string) => {
    const res = await fetch('/api/orders/admin', { headers: { 'x-orders-admin': token } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not load orders.');
    setOrders(data.orders || []);
    setRequests(data.requests || []);
  };

  useEffect(() => {
    if (!authed || !password) return;
    load(password).catch((err: Error) => {
      setError(err.message);
      setAuthed(false);
      sessionStorage.removeItem(SESSION_KEY);
    });
  }, [authed, password]);

  const onLogin = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await load(password);
      sessionStorage.setItem(SESSION_KEY, password);
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  const saveFulfillment = async (order: AdminOrder, fulfillmentStatus: string, trackingUrl: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/orders/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-orders-admin': password },
        body: JSON.stringify({ orderId: order.id, fulfillmentStatus, trackingUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not update fulfillment.');
      await load(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update fulfillment.');
    } finally {
      setBusy(false);
    }
  };

  const decide = async (requestId: string, decision: 'approved' | 'declined') => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/orders/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-orders-admin': password },
        body: JSON.stringify({ action: 'address', requestId, decision }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not update the request.');
      await load(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the request.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="bg-[#F6F1E8] px-5 pb-20 pt-28 md:px-8 md:pt-32">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-4xl font-black text-[#2D4F3E]">Orders</h1>
        <p className="mt-2 text-sm text-[#2D4F3E]/70">
          Payment status comes from Stripe. This page updates delivery and pickup only.
        </p>
        {error ? <p className="mt-4 text-sm text-[#B45309]">{error}</p> : null}

        {!authed ? (
          <form onSubmit={onLogin} className="mt-8 max-w-sm space-y-3">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Team password"
              className="w-full rounded-2xl border border-[#8C3F1F]/20 bg-white px-4 py-3 text-sm"
            />
            <button type="submit" disabled={busy} className="rounded-full bg-[#2D4F3E] px-6 py-3 text-xs font-black uppercase tracking-widest text-white">
              {busy ? 'Checking…' : 'Open orders'}
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-8">
            {requests.length > 0 ? (
              <section>
                <h2 className="font-serif text-2xl font-black text-[#2D4F3E]">Address requests</h2>
                <ul className="mt-3 space-y-3">
                  {requests.map((request) => (
                    <li key={request.id} className="rounded-2xl bg-white/60 px-4 py-4 text-sm text-[#2D4F3E]">
                      <p>
                        {request.line1}
                        {request.line2 ? `, ${request.line2}` : ''}, {request.city}, {request.state} {request.postal_code}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button type="button" disabled={busy} onClick={() => void decide(request.id, 'approved')} className="rounded-full bg-[#2D4F3E] px-4 py-2 text-xs font-black uppercase tracking-widest text-white">
                          Approve
                        </button>
                        <button type="button" disabled={busy} onClick={() => void decide(request.id, 'declined')} className="rounded-full border border-[#2D4F3E]/20 px-4 py-2 text-xs font-black uppercase tracking-widest">
                          Decline
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="space-y-4">
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} busy={busy} onSave={saveFulfillment} />
              ))}
              {orders.length === 0 ? <p className="text-sm text-[#2D4F3E]/70">No orders yet.</p> : null}
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

const OrderRow: React.FC<{
  order: AdminOrder;
  busy: boolean;
  onSave: (order: AdminOrder, fulfillmentStatus: string, trackingUrl: string) => Promise<void>;
}> = ({ order, busy, onSave }) => {
  const [fulfillmentStatus, setFulfillmentStatus] = useState(order.fulfillment_status || 'preparing');
  const [trackingUrl, setTrackingUrl] = useState(order.tracking_url || '');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSave(order, fulfillmentStatus, trackingUrl);
      }}
      className="rounded-[1.5rem] border border-[#2D4F3E]/10 bg-white/60 px-4 py-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8C3F1F]">
            {order.stripe_session_id?.startsWith('cs_test_') ? 'Test · ' : ''}
            {order.order_kind === 'preorder' ? 'Pre-order · ' : ''}
            {new Date(order.created_at).toLocaleString()} · {order.payment_status}
          </p>
          <p className="mt-1 text-sm text-[#2D4F3E]">{order.email || 'Guest'} · {order.fulfillment_type || 'delivery'}</p>
          {order.shipping_address ? <p className="mt-1 text-sm text-[#2D4F3E]/70">{order.shipping_address}</p> : null}
        </div>
        <p className="font-black text-[#2D4F3E]">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: (order.currency || 'usd').toUpperCase() }).format((order.amount_total || 0) / 100)}
        </p>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-[12rem_1fr_auto]">
        <select value={fulfillmentStatus} onChange={(event) => setFulfillmentStatus(event.target.value)} className="rounded-xl border border-[#8C3F1F]/20 bg-white px-3 py-2 text-sm">
          {FULFILLMENT.map((status) => (
            <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>
          ))}
        </select>
        <input
          value={trackingUrl}
          onChange={(event) => setTrackingUrl(event.target.value)}
          placeholder="Tracking link, if shipped"
          className="rounded-xl border border-[#8C3F1F]/20 bg-white px-3 py-2 text-sm"
        />
        <button type="submit" disabled={busy} className="rounded-full bg-[#2D4F3E] px-4 py-2 text-xs font-black uppercase tracking-widest text-white disabled:opacity-50">
          Save
        </button>
      </div>
    </form>
  );
};

export default OrdersAdminPage;
