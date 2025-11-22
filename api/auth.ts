import { createClient, Errors } from '@farcaster/quick-auth';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Domain should match your mini app's deployment domain
// For local development, this can be localhost
const domain = process.env.FARCASTER_DOMAIN || 'lapu.gg';

const client = createClient();

/**
 * Authentication endpoint that verifies Farcaster Quick Auth JWT tokens
 * Returns the authenticated user's FID (Farcaster ID)
 */
export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Only allow GET requests
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Extract Bearer token from Authorization header
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'Unauthorized: Missing or invalid authorization header' });
  }

  const token = authorization.split(' ')[1];

  try {
    // Verify the JWT token with Quick Auth
    const payload = await client.verifyJwt({ token, domain });

    // Return the authenticated user's FID
    return response.status(200).json({
      fid: payload.sub,
      authenticated: true,
    });
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      return response.status(401).json({
        error: 'Invalid token',
        authenticated: false,
      });
    }

    // Log unexpected errors for debugging
    console.error('Authentication error:', e);
    return response.status(500).json({
      error: 'Internal server error',
      authenticated: false,
    });
  }
}
