/**
 * FIX #2: Standardize Response Format
 * 
 * Problem: Response format is inconsistent across endpoints
 * Solution: Ensure all responses use consistent wrapper
 * Time: 45 minutes
 * 
 * File: workers/src/utils.ts
 */

// ============= RESPONSE WRAPPER =============

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  error: string | null;
  timestamp: number;
}

/**
 * Standard success response
 */
export function successResponse<T = any>(
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data: data,
    message: message,
    error: null,
    timestamp: Date.now(),
  };

  return new Response(JSON.stringify(response), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

/**
 * Standard error response
 */
export function errorResponse(
  message: string,
  statusCode: number = 500
): Response {
  const response: ApiResponse = {
    success: false,
    data: null,
    message: message,
    error: message,
    timestamp: Date.now(),
  };

  return new Response(JSON.stringify(response), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

/**
 * Bad request response (400)
 */
export function badRequestResponse(message: string): Response {
  return errorResponse(message, 400);
}

/**
 * Unauthorized response (401)
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): Response {
  return errorResponse(message, 401);
}

/**
 * Forbidden response (403)
 */
export function forbiddenResponse(message: string = 'Forbidden'): Response {
  return errorResponse(message, 403);
}

/**
 * Not found response (404)
 */
export function notFoundResponse(message: string = 'Not Found'): Response {
  return errorResponse(message, 404);
}

// ============= CORS HEADERS =============

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // TODO: Change to specific origin in production
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// ============= USAGE EXAMPLES =============

/*
// ✅ CORRECT - All endpoints should use this format

// Success with data
return successResponse({ user: {...}, token: '...' }, 'Login successful');

// Success without data
return successResponse(null, 'Logout successful');

// Error
return errorResponse('Invalid credentials', 401);

// Bad request
return badRequestResponse('Missing email field');

// Unauthorized
return unauthorizedResponse('Token expired');

// Not found
return notFoundResponse('User not found');

// ============= RESPONSE FORMAT =============

// Request:
GET /api/users/me
Authorization: Bearer token123

// Response (200 OK):
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "test@example.com",
    "displayName": "Test User"
  },
  "message": "Success",
  "error": null,
  "timestamp": 1234567890
}

// Error Response (401 Unauthorized):
{
  "success": false,
  "data": null,
  "message": "Token expired",
  "error": "Token expired",
  "timestamp": 1234567890
}

// ============= FRONTEND PARSING =============

// File: utils/apiClient.ts

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || error.message || `API Error: ${response.status}`);
  }

  const result = await response.json();
  
  // ✅ ALWAYS return data property
  return result.data || result;
}

// ============= TEST COMMANDS =============

/*
# Test 1: Success response
curl -X GET http://localhost:8787/api/users/me \
  -H "Authorization: Bearer valid_token" | jq .

# Expected:
{
  "success": true,
  "data": {...},
  "message": "Success",
  "error": null,
  "timestamp": 1234567890
}

# Test 2: Error response
curl -X GET http://localhost:8787/api/users/me \
  -H "Authorization: Bearer invalid_token" | jq .

# Expected:
{
  "success": false,
  "data": null,
  "message": "Token expired",
  "error": "Token expired",
  "timestamp": 1234567890
}

# Test 3: Bad request
curl -X POST http://localhost:8787/api/users/register \
  -H "Content-Type: application/json" \
  -d '{}' | jq .

# Expected:
{
  "success": false,
  "data": null,
  "message": "Missing required fields",
  "error": "Missing required fields",
  "timestamp": 1234567890
}
*/

// ============= CHECKLIST =============
/*
✅ Update successResponse() function
✅ Update errorResponse() function
✅ Add badRequestResponse() function
✅ Add unauthorizedResponse() function
✅ Add forbiddenResponse() function
✅ Add notFoundResponse() function
✅ Update all endpoints to use new functions
✅ Test all response formats
✅ Verify frontend can parse responses
✅ Deploy to staging
*/

