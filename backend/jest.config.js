/** @type {import('jest').Config} */
module.exports = {
  // Plain Node — there is no DOM here, unlike the frontend suite which runs
  // under jsdom via next/jest.
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middleware/**/*.js',
    'services/**/*.js',
    'utils/**/*.js'
  ]
};
