import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { searchquery } = req.body;
  console.log('API gateway request received. Search query:', searchquery);
  
  const apiUrl = `${process.env.SUPABASE_URL}/embedsearch`;
  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: searchquery }),
  };

  try {
    const response = await fetch(apiUrl, requestOptions);
  
    if (response.ok) {
      const data = await response.json();
      // console.log('API response data:', data);
      res.status(200).json(data);
    } else {
      console.log('API response error:', response.statusText);
      res.status(response.status).end();
    }
  } catch (error) {
    console.log('API request error:', error);
    res.status(500).end();
  }
}