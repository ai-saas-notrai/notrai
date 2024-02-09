import { NextApiRequest, NextApiResponse } from 'next';
import { userSettings } from '../../../lib/userSettings';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userId = req.query.userId;
  
    // Check if userId is a string; respond with an error if not
    if (typeof userId !== 'string') {
      return res.status(400).json({ error: "Invalid userId" });
    }
  
    try {
      if (req.method === 'GET') {
        const userData = await userSettings('fetch', userId);
        res.status(200).json(userData);
      } else if (req.method === 'POST') {
        const data = req.body;
        const updatedUserData = await userSettings('update', userId, data);
        res.status(200).json(updatedUserData);
      } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end('Method Not Allowed');
      }
    } catch (error) {
        console.error("Error fetching user state:", error);
        // Asserting error as an instance of the Error class to access its message property
        res.status(500).json({ error: "Internal server error", details: (error as Error).message });
      }
      
  }
  