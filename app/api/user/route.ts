import { NextApiRequest, NextApiResponse } from 'next';
import { userSettings } from '../../../lib/userSettings'; // Make sure this path is correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userId = typeof req.query.userId === 'string' ? req.query.userId : null;

  if (!userId) {
    return res.status(400).json({ error: 'A valid userId is required' });
  }

  try {
    if (req.method === 'GET') {
      // Fetch user settings
      const result = await userSettings('fetch', userId);
      res.status(200).json(result);
    } else if (req.method === 'POST') {
      // Ensure body exists and is correctly structured for an update
      const data = req.body;
      if (!data) {
        return res.status(400).json({ error: 'Data for update is required' });
      }
      // Update user settings
      const result = await userSettings('update', userId, data);
      res.status(200).json(result);
    } else {
      // If the method is neither GET nor POST
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
}
