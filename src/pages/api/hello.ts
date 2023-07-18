import type { NextApiRequest, NextApiResponse } from 'next'

// [GET] /api/hello
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ text: 'Hello' });
}