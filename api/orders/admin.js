import {
  decideAddressRequest,
  isOrdersAdmin,
  listAdminOrders,
  updateFulfillment,
} from '../../server/ordersApi.mjs';

export default async function handler(req, res) {
  if (!isOrdersAdmin(req)) return res.status(401).json({ error: 'Unauthorized.' });

  try {
    if (req.method === 'GET') {
      const result = await listAdminOrders();
      return res.status(result.status).json(result.body);
    }
    if (req.method === 'POST') {
      const result = req.body?.action === 'address'
        ? await decideAddressRequest(req.body)
        : await updateFulfillment(req.body);
      return res.status(result.status).json(result.body);
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[orders admin]', err);
    return res.status(500).json({ error: 'Could not update orders.' });
  }
}
