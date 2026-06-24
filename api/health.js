import { getHealthPayload } from '../server/shopApi.mjs';

export default function handler(_req, res) {
  return res.status(200).json(getHealthPayload());
}
