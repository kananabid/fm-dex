/**
 * Global Teardown for Playwright Tests
 * Runs once after all tests complete
 */

export default async function globalTeardown() {
  console.log('\nTest suite completed\n');
  console.log('Reports generated:');
  console.log('- HTML: playwright-report/index.html');
  console.log('- JSON: test-results/results.json\n');
}
