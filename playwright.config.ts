import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  reporter: [
    ['list'],
    ['json', {  outputFile: './results/test-results.json' }]
  ],
};
export default config;