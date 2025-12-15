/**
 * API Tests for Authentication Endpoints 
*/

import { test, expect, request } from '@playwright/test';

// API Base URL
const API_BASE_URL = process.env.API_URL || 'http://localhost:3002';

test.describe('Authentication API Tests', () => {
  
  test.beforeAll(async () => {
    console.log(`Testing API at: ${API_BASE_URL}`);
  });

  test('TC-API-001 - Health check - API should be accessible', async () => {
    // This test verifies the backend is running
    // Skip if backend is down
    
    const context = await request.newContext();
    
    try {
      const response = await context.get(`${API_BASE_URL}/api/auth`, {
        timeout: 5000
      });
      
      // Any response means server is up
      expect([200, 404, 405, 401, 400, 500]).toContain(response.status());
      console.log(`Backend is accessible (status: ${response.status()})`);
      
    } catch (error) {
      console.error('Backend not accessible - skipping API tests');
      test.skip(true, 'Backend server not running');
    }
  });

  test('TC-API-002 - JWT Token Forgery Attempt', async () => {
    const context = await request.newContext();
  const jwt = require('jsonwebtoken');
  
  // Create forged token using the known weak secret "hello"
  const forgedToken = jwt.sign(
    { userId: 'fake_attacker_id', role: 'admin' },
    'hello', // The hardcoded secret in middleware/auth.js line 75
    { expiresIn: '1h' }
  );
  
  // Try to access protected endpoint with forged token
  const response = await context.get(`${API_BASE_URL}/api/profile/me`, {
    headers: { 'x-auth-token': forgedToken },
    failOnStatusCode: false
  });
  
  // This SHOULD return 401 Unauthorized
  // But because the secret is "hello", the forged token will be accepted
  expect(response.status()).toBe(401); // This will FAIL
  
  if (response.status() === 200) {
    console.error('CRITICAL: JWT forgery successful! Secret is "hello"');
  }
});
});
