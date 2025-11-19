/**
 * Jest Configuration Example
 * Ready-to-use Jest configuration for a React/TypeScript project
 */

import { reactConfig } from '@kitium-ai/lint/jest';

export default {
  ...reactConfig,
  displayName: 'unit',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{test,spec}.{js,ts,jsx,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,ts,jsx,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,ts,jsx,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,ts,jsx,tsx}',
    '!src/index.{js,ts}',
    '!src/**/__tests__/**',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/.next/',
  ],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  setupFiles: ['<rootDir>/jest.env.js'],
};
