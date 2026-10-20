import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import background4Img from '../materials/background 4.png';
import heroMobileImg from '../materials/hero-mobile.png';

type OrderItem = {
  name: string;
  quantity: number;
  unit_amount?: number | null;
  amount: number | null;
};

type ShopOrder = {
  id: string;
  order_kind: string | null;
  payment_status: string;
  fulfillment_status: string | null;
  fulfillment_type: string | null;
  delivery_zip: string | null;
  pickup_location: string | null;
  shipping_address: string | null;
  ship_city: string | null;
  ship_state: string | null;
  phone: string | null;
  delivery_window: string | null;
  amount_total: number | null;
  amount_refunded: number | null;
  currency: string;
  items: OrderItem[];
  tracking_url: string | null;
  created_at: string;
};

type AddressRequest = {
  id: string;
  order_id: string;
  status: string;
  line1: string;
  city: string;
  state: string;
  postal_code: string;
};

const fieldClass =
  'w-full rounded-2xl border border-[#8C3F1F]/25 bg-white px-4 py-3.5 text-sm text-[#8C3F1F] outline-none transition-colors placeholder:text-[#8C3F1F]/40 focus:border-[#8C3F1F]';

const settingsLabelClass = 'block text-sm font-medium text-[#8C3F1F]/80';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM',
  'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA',
  'WV', 'WI', 'WY',
];

const cardClass = 'rounded-[1.75rem] bg-[#F6F1E8] px-5 py-6 shadow-[0_24px_80px_rgba(58,26,16,0.22)] sm:px-6';

function SettingsSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border-l-[6px] border-[#8C3F1F] bg-[#F6F1E8] text-[#8C3F1F] shadow-[0_16px_40px_rgba(58,26,16,0.18)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left"
      >
        <span className="font-serif text-lg font-bold md:text-xl">{title}</span>
        <span className={`text-lg leading-none text-[#8C3F1F]/45 transition-transform ${open ? 'rotate-90' : ''}`} aria-hidden="true">
          ›
        </span>
      </button>
      {open ? <div className="border-t border-[#8C3F1F]/10 px-5 pb-6 pt-5">{children}</div> : null}
    </section>
  );
}

const AccountPhoto: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 z-0">
    <img src={heroMobileImg} alt="" className="h-full w-full object-cover object-center md:hidden" />
    <img src={background4Img} alt="" className="hidden h-full w-full object-cover object-center md:block" />
    <div className="absolute inset-0 bg-[#1A0C08]/35" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.08),transparent_55%)]" />
  </div>
);

const FULFILLMENT_LABELS: Record<string, string> = {
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for pickup',
  shipped: 'Shipped',
  delivered: 'Delivered',
  picked_up: 'Picked up',
};

function money(cents: number | null, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'usd').toUpperCase(),
  }).format((cents ?? 0) / 100);
}

function orderDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function placeLabel(order: ShopOrder) {
  if (order.fulfillment_type === 'pickup') return order.pickup_location || 'Pickup';
  if (order.ship_city && order.ship_state) return `${order.ship_city}, ${order.ship_state}`;
  return order.shipping_address || order.delivery_zip || 'Address on file';
}

function orderTitle(order: ShopOrder) {
  if (order.order_kind === 'preorder' && order.payment_status === 'paid') return 'Pre-order Confirmed';
  if (order.order_kind === 'preorder') return 'Pre-order';
  return FULFILLMENT_LABELS[order.fulfillment_status || ''] || 'Waiting for payment';
}

function asItems(value: unknown): OrderItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const row = item as Partial<OrderItem>;
      return {
        name: String(row.name || 'Item'),
        quantity: Number(row.quantity) || 1,
        unit_amount: Number.isInteger(row.unit_amount) ? row.unit_amount : null,
        amount: Number.isInteger(row.amount) ? row.amount : null,
      };
    });
}

function canRequestAddressChange(order: ShopOrder) {
  return order.payment_status === 'paid'
    && order.fulfillment_type === 'delivery'
    && order.fulfillment_status === 'preparing';
}

const AccountPage: React.FC = () => {
  const {
    loading,
    session,
    user,
    profile,
    profileError,
    updateProfile,
    requestEmailChange,
    signOut,
  } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'settings' ? 'settings' : 'orders';
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [requests, setRequests] = useState<AddressRequest[]>([]);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressPostalCode, setAddressPostalCode] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [nextEmail, setNextEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [openSection, setOpenSection] = useState<'personal' | 'address' | 'email' | 'security' | null>(
    tab === 'settings' ? 'personal' : null
  );
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0);
  const [deletePhrase, setDeletePhrase] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [addressDraft, setAddressDraft] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
  });
  const [addressNotice, setAddressNotice] = useState<string | null>(null);

  useEffect(() => {
    setFullName(profile?.full_name || '');
    setPhone(profile?.phone || '');
    setAddressLine1(profile?.address_line1 || '');
    setAddressLine2(profile?.address_line2 || '');
    setAddressCity(profile?.address_city || '');
    setAddressState(profile?.address_state || '');
    setAddressPostalCode(profile?.address_postal_code || '');
    setMarketingOptIn(Boolean(profile?.marketing_opt_in));
  }, [profile]);

  const loadOrders = async (userId: string) => {
    if (!supabase) return;
    const [orderResult, requestResult] = await Promise.all([
      supabase
        .from('orders')
        .select(
          'id, order_kind, payment_status, fulfillment_status, fulfillment_type, delivery_zip, pickup_location, shipping_address, ship_city, ship_state, phone, delivery_window, amount_total, amount_refunded, currency, items, tracking_url, created_at'
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('order_address_requests')
        .select('id, order_id, status, line1, city, state, postal_code')
        .eq('user_id', userId)
        .eq('status', 'pending'),
    ]);

    if (orderResult.error) {
      setOrdersError(
        /orders|schema cache|relation|column/i.test(orderResult.error.message)
          ? 'Order history is not ready yet. Run supabase/accounts.sql in the Supabase SQL editor.'
          : orderResult.error.message
      );
      setOrders([]);
      return;
    }

    setOrdersError(null);
    setOrders(
      (orderResult.data || []).map((row) => ({
        ...(row as Omit<ShopOrder, 'items'>),
        items: asItems(row.items),
      }))
    );
    setRequests((requestResult.data || []) as AddressRequest[]);
  };

  useEffect(() => {
    if (!user || !supabase) {
      setOrdersLoading(false);
      return;
    }
    let active = true;
    setOrdersLoading(true);
    loadOrders(user.id)
      .catch((err: Error) => {
        if (active) setOrdersError(err.message);
      })
      .finally(() => {
        if (active) setOrdersLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user?.id]);

  if (loading) {
    return (
      <main className="relative flex jj-min-screen items-center justify-center overflow-hidden px-5 pb-20 pt-32">
        <AccountPhoto />
        <p className="relative z-10 text-center text-sm text-white">Loading your account…</p>
      </main>
    );
  }

  if (!user) return <Navigate to="/login?next=/account" replace />;

  const setTab = (next: 'orders' | 'settings') => {
    const nextParams = new URLSearchParams(params);
    if (next === 'orders') nextParams.delete('tab');
    else nextParams.set('tab', 'settings');
    setParams(nextParams, { replace: true });
    setNotice(null);
    setFormError(null);
    if (next === 'settings') setOpenSection('personal');
  };

  const onSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotice(null);
    setFormError(null);
    setSavingProfile(true);
    const error = await updateProfile({
      fullName,
      phone,
      addressLine1,
      addressLine2,
      addressCity,
      addressState,
      addressPostalCode,
      marketingOptIn,
    });
    setSavingProfile(false);
    if (error) setFormError(error);
    else setNotice('Saved.');
  };

  const onSavePreferences = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotice(null);
    setFormError(null);
    setSavingPreferences(true);
    const error = await updateProfile({
      fullName,
      phone,
      addressLine1,
      addressLine2,
      addressCity,
      addressState,
      addressPostalCode,
      marketingOptIn,
    });
    setSavingPreferences(false);
    if (error) setFormError(error);
    else setNotice('Preferences saved.');
  };

  const onChangeEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotice(null);
    setFormError(null);
    setSavingEmail(true);
    const error = await requestEmailChange(nextEmail);
    setSavingEmail(false);
    if (error) setFormError(error);
    else {
      setNextEmail('');
      setNotice('Check both inboxes and confirm the new sign-in email before it changes.');
    }
  };

  const closeDelete = () => {
    setDeleteStep(0);
    setDeletePhrase('');
    setDeletingAccount(false);
    setFormError(null);
    setOpenSection('security');
  };

  const toggleSection = (section: 'personal' | 'address' | 'email' | 'security') => {
    setOpenSection((current) => (current === section ? null : section));
    setNotice(null);
    setFormError(null);
  };

  const onDeleteAccount = async () => {
    if (deletePhrase !== 'DELETE' || !session?.access_token) return;
    setFormError(null);
    setDeletingAccount(true);
    const res = await fetch('/api/account/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ confirmation: 'DELETE' }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setDeletingAccount(false);
      setFormError(data.error || 'Could not delete this account.');
      return;
    }
    await signOut();
    navigate('/');
  };

  const onRequestAddress = async (event: React.FormEvent, orderId: string) => {
    event.preventDefault();
    if (!session?.access_token) return;
    setAddressNotice(null);
    const res = await fetch('/api/orders/address-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ orderId, ...addressDraft }),
    });
    const data = await res.json();
    if (!res.ok) {
      setAddressNotice(data.error || 'Could not send that request.');
      return;
    }
    setEditingOrderId(null);
    setAddressNotice('Request sent. The original address stays on the order until the team approves a change.');
    await loadOrders(user.id);
  };

  const displayName = profile?.full_name?.trim() || 'Your account';

  return (
    <main className="relative overflow-x-hidden px-5 pb-20 pt-28 md:px-8 md:pt-36 jj-min-screen">
      <AccountPhoto />
      <div className="relative z-10 mx-auto min-h-[70vh] max-w-3xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/80">Account</p>
            <h1 className="mt-2 font-serif text-4xl font-black text-white md:text-5xl">{displayName}</h1>
            <p className="mt-2 text-sm text-white/80">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="rounded-full border border-white/55 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[#8C3F1F]"
          >
            Sign out
          </button>
        </div>

        <div className="mt-8 flex gap-2">
          {(['orders', 'settings'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-colors ${
                tab === item ? 'bg-white text-[#8C3F1F]' : 'text-white hover:bg-white/15'
              }`}
            >
              {item === 'orders' ? 'Orders' : 'Settings'}
            </button>
          ))}
        </div>

        {profileError ? (
          <p className="mt-6 rounded-2xl bg-[#F3E6D7] px-4 py-3 text-sm leading-relaxed text-[#8C3F1F]">{profileError}</p>
        ) : null}

        {tab === 'orders' ? (
          <section className="mt-6 space-y-4">
            {ordersLoading ? <p className="text-sm text-white/85">Loading orders…</p> : null}
            {ordersError ? (
              <p className="rounded-2xl bg-[#F3E6D7] px-4 py-3 text-sm leading-relaxed text-[#8C3F1F]">{ordersError}</p>
            ) : null}
            {!ordersLoading && !ordersError && orders.length === 0 ? (
              <div className={`${cardClass} text-center`}>
                <h2 className="font-serif text-3xl font-black text-[#8C3F1F]">No orders yet</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#8C3F1F]/75">
                  Sign in before checkout and the order stays on this account, including if you change your email later.
                </p>
                <Link
                  to="/shop"
                  className="mt-6 inline-flex rounded-full bg-[#8C3F1F] px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-[#F47C3E]"
                >
                  Visit the shop
                </Link>
              </div>
            ) : null}
            {addressNotice ? <p className="text-sm text-white">{addressNotice}</p> : null}
            {orders.map((order) => {
              const pending = requests.find((request) => request.order_id === order.id);
              const tracking = order.tracking_url && /^https?:\/\//i.test(order.tracking_url) ? order.tracking_url : '';
              const isPreorder = order.order_kind === 'preorder';
              const lines = order.items.length > 0 ? order.items : [{ name: 'Jiva Early Bird', quantity: 1, amount: order.amount_total }];
              return (
                <article key={order.id} className={`${cardClass} text-[#8C3F1F]`}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8C3F1F]/55">
                    {isPreorder ? 'Pre-order · ' : ''}
                    {orderDate(order.created_at)}
                  </p>
                  <h2 className="mt-3 text-lg font-bold">{orderTitle(order)}</h2>
                  {isPreorder ? (
                    <p className="mt-2 text-sm leading-relaxed text-[#8C3F1F]/75">
                      Your Jiva is reserved! We&apos;ll email you when your order is ready for delivery. Thanks for joining us early.
                    </p>
                  ) : null}
                  <div className="mt-5 border-t border-[#8C3F1F]/15 pt-5">
                    <ul className="space-y-4">
                      {lines.map((item, index) => (
                        <li key={`${order.id}-${index}`}>
                          <p className="font-bold">
                            {item.quantity} × {item.name}
                          </p>
                          {item.amount != null ? <p className="mt-1 font-bold">{money(item.amount, order.currency)}</p> : null}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 space-y-3 text-sm">
                      <div className="flex items-start justify-between gap-6">
                        <span className="text-[#8C3F1F]/55">{order.fulfillment_type === 'pickup' ? 'Pickup' : 'Delivery'}</span>
                        <span className="text-right">{placeLabel(order)}</span>
                      </div>
                      <div className="flex items-start justify-between gap-6">
                        <span className="text-[#8C3F1F]/55">Estimated delivery</span>
                        <span className="text-right">{order.delivery_window || 'Date to be confirmed'}</span>
                      </div>
                      {order.phone ? (
                        <div className="flex items-start justify-between gap-6">
                          <span className="text-[#8C3F1F]/55">Phone</span>
                          <span className="text-right">{order.phone}</span>
                        </div>
                      ) : null}
                      {order.amount_refunded ? (
                        <div className="flex items-start justify-between gap-6">
                          <span className="text-[#8C3F1F]/55">Refunded</span>
                          <span className="text-right">{money(order.amount_refunded, order.currency)}</span>
                        </div>
                      ) : null}
                      {tracking ? (
                        <a href={tracking} className="inline-block font-semibold underline" target="_blank" rel="noreferrer">
                          Track shipment
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-[#8C3F1F]/15 pt-5">
                    {canRequestAddressChange(order) && !pending ? (
                      <button
                        type="button"
                        onClick={() => setEditingOrderId(order.id)}
                        className="rounded-full border border-[#8C3F1F]/25 px-4 py-2 text-sm font-medium text-[#8C3F1F] hover:bg-white/50"
                      >
                        Request address change
                      </button>
                    ) : null}
                    {isPreorder ? (
                      <a href="mailto:info@jivalivin.com?subject=Cancel%20pre-order" className="text-sm text-[#8C3F1F]/75 hover:text-[#8C3F1F]">
                        Cancel pre-order
                      </a>
                    ) : null}
                  </div>
                  {pending ? (
                    <p className="mt-3 text-sm text-[#8C3F1F]/75">
                      Address change requested: {pending.line1}, {pending.city}, {pending.state} {pending.postal_code}
                    </p>
                  ) : null}
                  {editingOrderId === order.id ? (
                    <form onSubmit={(event) => void onRequestAddress(event, order.id)} className="mt-4 grid gap-2">
                      <input required placeholder="Street" value={addressDraft.line1} onChange={(event) => setAddressDraft({ ...addressDraft, line1: event.target.value })} className={fieldClass} />
                      <input placeholder="Apt, suite" value={addressDraft.line2} onChange={(event) => setAddressDraft({ ...addressDraft, line2: event.target.value })} className={fieldClass} />
                      <div className="grid gap-2 sm:grid-cols-3">
                        <input required placeholder="City" value={addressDraft.city} onChange={(event) => setAddressDraft({ ...addressDraft, city: event.target.value })} className={fieldClass} />
                        <input required placeholder="State" value={addressDraft.state} onChange={(event) => setAddressDraft({ ...addressDraft, state: event.target.value })} className={fieldClass} />
                        <input required placeholder="ZIP" value={addressDraft.postalCode} onChange={(event) => setAddressDraft({ ...addressDraft, postalCode: event.target.value })} className={fieldClass} />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="rounded-full bg-[#8C3F1F] px-4 py-2 text-xs font-black uppercase tracking-widest text-white">
                          Send request
                        </button>
                        <button type="button" onClick={() => setEditingOrderId(null)} className="text-xs font-bold uppercase tracking-widest text-[#8C3F1F]">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : null}
                </article>
              );
            })}
          </section>
        ) : deleteStep > 0 ? (
          <section className={`${cardClass} mt-6 text-[#8C3F1F]`}>
            {deleteStep === 1 ? (
              <>
                <h2 className="text-lg font-bold">Delete account</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#8C3F1F]/75">
                  This removes your Jiva sign-in and the details saved on this account.
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#8C3F1F]/75">
                  <li>Your name, phone number, and saved address</li>
                  <li>Email preferences</li>
                  <li>The email you use to sign in</li>
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-[#8C3F1F]/75">
                  Orders already placed stay on file so we can deliver them. Deleting your account does not cancel or refund a pre-order.
                  To cancel one, use Orders or email info@jivalivin.com.
                </p>
                <p className="mt-4 text-sm font-semibold">This cannot be undone.</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setDeleteStep(2)}
                    className="rounded-full bg-[#8C3F1F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#F47C3E]"
                  >
                    Continue
                  </button>
                  <button type="button" onClick={closeDelete} className="text-sm font-medium text-[#8C3F1F]/75">
                    Keep my account
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold">Confirm again</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#8C3F1F]/75">
                  Type DELETE to permanently delete the account for {user.email}.
                </p>
                <input
                  value={deletePhrase}
                  onChange={(event) => setDeletePhrase(event.target.value)}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  placeholder="DELETE"
                  className={`${fieldClass} mt-5`}
                />
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    disabled={deletePhrase !== 'DELETE' || deletingAccount}
                    onClick={() => void onDeleteAccount()}
                    className="rounded-full bg-[#8C3F1F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#F47C3E] disabled:opacity-40"
                  >
                    {deletingAccount ? 'Deleting…' : 'Delete my account'}
                  </button>
                  <button type="button" onClick={closeDelete} className="text-sm font-medium text-[#8C3F1F]/75">
                    Keep my account
                  </button>
                </div>
              </>
            )}
            {formError ? <p className="mt-4 text-sm text-[#9B2C2C]">{formError}</p> : null}
          </section>
        ) : (
          <div className="mt-6 space-y-3">
            <SettingsSection title="Personal Information" open={openSection === 'personal'} onToggle={() => toggleSection('personal')}>
              <form onSubmit={onSaveProfile} className="space-y-4">
                <label className={settingsLabelClass}>
                  Name
                  <input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" placeholder="Your name" className={`${fieldClass} mt-2`} />
                </label>
                <label className={settingsLabelClass}>
                  Phone number
                  <input value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" placeholder="Your phone number" className={`${fieldClass} mt-2`} />
                </label>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="rounded-full bg-[#8C3F1F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#F47C3E] disabled:opacity-50"
                >
                  {savingProfile ? 'Saving…' : 'Save changes'}
                </button>
              </form>
            </SettingsSection>

            <SettingsSection title="Delivery Address" open={openSection === 'address'} onToggle={() => toggleSection('address')}>
              <form onSubmit={onSaveProfile}>
                <p className="text-sm leading-relaxed text-[#8C3F1F]/70">
                  Your default address for future orders. To update an existing order, request a change under Orders.
                </p>
                <div className="mt-5 space-y-4">
                  <label className={settingsLabelClass}>
                    Street address
                    <input value={addressLine1} onChange={(event) => setAddressLine1(event.target.value)} autoComplete="address-line1" placeholder="123 Main St" className={`${fieldClass} mt-2`} />
                  </label>
                  <label className={settingsLabelClass}>
                    Apartment, unit, etc. (optional)
                    <input value={addressLine2} onChange={(event) => setAddressLine2(event.target.value)} autoComplete="address-line2" placeholder="Apt 4B" className={`${fieldClass} mt-2`} />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className={settingsLabelClass}>
                      City
                      <input value={addressCity} onChange={(event) => setAddressCity(event.target.value)} autoComplete="address-level2" placeholder="Los Angeles" className={`${fieldClass} mt-2`} />
                    </label>
                    <label className={settingsLabelClass}>
                      State
                      <select value={addressState} onChange={(event) => setAddressState(event.target.value)} autoComplete="address-level1" className={`${fieldClass} mt-2`}>
                        <option value="">State</option>
                        {addressState && !US_STATES.includes(addressState) ? <option value={addressState}>{addressState}</option> : null}
                        {US_STATES.map((code) => (
                          <option key={code} value={code}>{code}</option>
                        ))}
                      </select>
                    </label>
                    <label className={settingsLabelClass}>
                      ZIP
                      <input value={addressPostalCode} onChange={(event) => setAddressPostalCode(event.target.value)} autoComplete="postal-code" placeholder="90001" className={`${fieldClass} mt-2`} />
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="mt-6 rounded-full bg-[#8C3F1F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#F47C3E] disabled:opacity-50"
                >
                  {savingProfile ? 'Saving…' : 'Save changes'}
                </button>
              </form>
            </SettingsSection>

            <SettingsSection title="Email Preferences" open={openSection === 'email'} onToggle={() => toggleSection('email')}>
              <form onSubmit={onSavePreferences}>
                <div className="space-y-4 text-sm leading-relaxed">
                  <div>
                    <p className="font-semibold">Order updates</p>
                    <p className="mt-1 text-[#8C3F1F]/70">Shipping and delivery notices. These stay on.</p>
                  </div>
                  <label className="flex items-start gap-3">
                    <input type="checkbox" checked={marketingOptIn} onChange={(event) => setMarketingOptIn(event.target.checked)} className="mt-1 accent-[#8C3F1F]" />
                    <span>
                      <span className="font-semibold">Keep me in the loop with new drops, exclusive offers, and all things Jiva.</span>
                      <span className="mt-1 block text-[#8C3F1F]/70">Product news, launches, and occasional offers. No spam.</span>
                    </span>
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={savingPreferences}
                  className="mt-6 rounded-full bg-[#8C3F1F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#F47C3E] disabled:opacity-50"
                >
                  {savingPreferences ? 'Saving…' : 'Save preferences'}
                </button>
              </form>
            </SettingsSection>

            <SettingsSection title="Account & Security" open={openSection === 'security'} onToggle={() => toggleSection('security')}>
              <button
                type="button"
                onClick={() => {
                  setEditingEmail((open) => !open);
                  setFormError(null);
                  setNotice(null);
                }}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span>
                  <span className="block font-semibold">Sign-in email</span>
                  <span className="mt-1 block text-sm text-[#8C3F1F]/60">Manage the email associated with your account</span>
                </span>
                <span className="text-lg text-[#8C3F1F]/45" aria-hidden="true">›</span>
              </button>
              {editingEmail ? (
                <form onSubmit={onChangeEmail} className="mt-4">
                  <p className="text-sm text-[#8C3F1F]/70">{user.email}</p>
                  <input
                    type="email"
                    required
                    value={nextEmail}
                    onChange={(event) => setNextEmail(event.target.value)}
                    placeholder="New email"
                    className={`${fieldClass} mt-3`}
                  />
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={savingEmail}
                      className="rounded-full bg-[#8C3F1F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#F47C3E] disabled:opacity-50"
                    >
                      {savingEmail ? 'Sending…' : 'Send confirmation'}
                    </button>
                    <button type="button" onClick={() => setEditingEmail(false)} className="text-sm font-medium text-[#8C3F1F]/70">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : null}
              <div className="mt-5 space-y-1 border-t border-[#8C3F1F]/15 pt-4 text-sm text-[#8C3F1F]/70">
                <p>{user.email_confirmed_at ? 'Email verified' : 'Email not verified yet'}</p>
                <p>{(user.identities || []).some((identity) => identity.provider === 'google') ? 'Connected with Google' : 'You can also continue with Google'}</p>
                <p>This account has no password.</p>
                <p className="pt-2">
                  Need help?{' '}
                  <a href="mailto:info@jivalivin.com" className="font-semibold underline">
                    Contact Jiva Support
                  </a>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDeleteStep(1);
                  setDeletePhrase('');
                  setFormError(null);
                  setNotice(null);
                }}
                className="mt-4 flex w-full items-center justify-between gap-4 border-t border-[#8C3F1F]/15 pt-4 text-left"
              >
                <span>
                  <span className="block font-semibold">Delete account</span>
                  <span className="mt-1 block text-sm text-[#8C3F1F]/60">Permanently delete your Jiva account</span>
                </span>
                <span className="text-lg text-[#8C3F1F]/45" aria-hidden="true">›</span>
              </button>
            </SettingsSection>

            {formError ? <p className="text-sm text-[#F9D067]">{formError}</p> : null}
            {notice ? <p className="text-sm text-white">{notice}</p> : null}
          </div>
        )}
      </div>
    </main>
  );
};

export default AccountPage;
