const nextJest = require('next/jest');

// next/jest wires up SWC transforms, next.config.js, CSS/image mocks and the
// "@/*" path alias so tests resolve the same way the app does.
const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  // .next/standalone contains a copy of package.json, which collides with the
  // real one in jest-haste-map.
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
