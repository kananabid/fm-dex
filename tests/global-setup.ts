/**
 * Global Setup for Playwright Tests
 * Runs once before all tests
 */

export default async function globalSetup() {
  console.log('\n🚀 Starting FM-DEX Test Suite...\n');
  
  // Environment validation
  const requiredEnvVars = [
    'NODE_ENV',
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Warning: Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Some tests may be skipped or fail.\n');
  }
  
  // Check if backend is required for tests
  console.log('Test Configuration:');
  console.log(`   - Frontend URL: http://localhost:3000`);
  console.log(`   - Backend URL: http://localhost:3002 (Currently has port mismatch issue)`);
  console.log(`   - Database: MongoDB (Currently disconnected)`);
  console.log('');
  
  // Note: Backend health check commented out due to known issues
  
  // try {
  //   const response = await fetch('http://localhost:3002/api/health');
  //   if (response.ok) {
  //     console.log('Backend server is healthy');
  //   } else {
  //     console.warn('Backend server returned non-200 status');
  //   }
  // } catch (error) {
  //   console.warn('Backend server not accessible');
  //   console.warn('API tests will be skipped');
  // }
  
  console.log('Starting test execution...\n');
}
