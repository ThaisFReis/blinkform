export default async (req: any, res: any) => {
  // Handle OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Encoding,Accept-Encoding');
    res.status(200).end();
    return;
  }

  // Simple health check response
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    return;
  }

  // Method not allowed
  res.status(405).json({ error: 'Method not allowed' });
};