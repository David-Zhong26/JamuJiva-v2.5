import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canRequestAddressChange,
  claimEmailFromUser,
  countsTowardPrelaunch,
  nextPaymentStatus,
  paymentPatch,
  paymentStatusFromRefund,
} from './orderState.mjs';

test('a newer paid event does not overwrite a refund', () => {
  const decision = nextPaymentStatus('refunded', 'paid', 200, 100);
  assert.equal(decision.applied, false);
  assert.equal(decision.status, 'refunded');
});

test('an older paid event does not overwrite a newer refund', () => {
  const decision = nextPaymentStatus('refunded', 'paid', 50, 100);
  assert.equal(decision.applied, false);
  assert.equal(decision.reason, 'stale');
});

test('a failed event does not downgrade a paid order', () => {
  const patch = paymentPatch(
    { payment_status: 'paid', payment_event_created: 100, fulfillment_status: 'preparing' },
    'failed',
    180
  );
  assert.equal(patch, null);
});

test('the first paid event starts fulfillment at preparing', () => {
  const patch = paymentPatch(null, 'paid', 10);
  assert.deepEqual(patch, {
    payment_status: 'paid',
    payment_event_created: 10,
    fulfillment_status: 'preparing',
  });
});

test('a refund after payment advances payment status and keeps fulfillment', () => {
  const patch = paymentPatch(
    { payment_status: 'paid', payment_event_created: 10, fulfillment_status: 'shipped' },
    'refunded',
    20,
    { amountRefunded: 1200 }
  );
  assert.equal(patch.payment_status, 'refunded');
  assert.equal(patch.fulfillment_status, undefined);
  assert.equal(patch.amount_refunded, 1200);
});

test('only a live Checkout session counts toward the pre-launch total', () => {
  assert.equal(countsTowardPrelaunch('cs_live_abc'), true);
  assert.equal(countsTowardPrelaunch('cs_test_abc'), false);
  assert.equal(countsTowardPrelaunch(''), false);
});

test('guest-order linking uses the verified account email only', () => {
  const user = {
    email: 'a@example.com',
    email_confirmed_at: '2026-01-01T00:00:00Z',
  };
  assert.equal(claimEmailFromUser(user), 'a@example.com');
  assert.equal(claimEmailFromUser({ email: 'a@example.com' }), null);
  assert.equal(
    claimEmailFromUser({
      email: 'a@example.com',
      app_metadata: { provider: 'google' },
    }),
    'a@example.com'
  );
});

test('a saved address does not make a shipped order editable', () => {
  assert.equal(
    canRequestAddressChange({
      payment_status: 'paid',
      fulfillment_type: 'delivery',
      fulfillment_status: 'preparing',
    }),
    true
  );
  assert.equal(
    canRequestAddressChange({
      payment_status: 'paid',
      fulfillment_type: 'delivery',
      fulfillment_status: 'shipped',
    }),
    false
  );
  assert.equal(
    canRequestAddressChange({
      payment_status: 'pending',
      fulfillment_type: 'delivery',
      fulfillment_status: 'preparing',
    }),
    false
  );
});

test('partial refunds stay distinct from a full refund', () => {
  assert.equal(paymentStatusFromRefund({ amount: 1000, amount_refunded: 400 }), 'partially_refunded');
  assert.equal(paymentStatusFromRefund({ amount: 1000, amount_refunded: 1000 }), 'refunded');
});
