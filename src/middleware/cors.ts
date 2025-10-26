import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

// Initialize CORS middleware
const cors = Cors({
  origin: '*', // Em produção, especifique os domínios permitidos
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

// Helper function to run middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
): Promise<any> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export async function applyCors(req: NextApiRequest, res: NextApiResponse) {
  // Run CORS middleware
  await runMiddleware(req, res, cors);

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // Indicates that request was handled
  }

  return false; // Continue with normal request handling
}
