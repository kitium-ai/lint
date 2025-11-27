/**
 * Jest Configuration Export
 * Provides ready-to-use Jest configurations for different project types
 */
import baseJestConfig from "@kitiumai/config/jest.config.base.cjs";

/**
 * Base Jest configuration for unit testing (extends shared preset)
 */
export const baseConfig = {
  ...baseJestConfig,
  collectCoverageFrom: [
    "src/**/*.{js,ts,jsx,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,ts,jsx,tsx}",
    "!src/index.{js,ts}",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

/**
 * React component testing configuration
 */
export const reactConfig = {
  ...baseConfig,
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  globals: {
    "ts-jest": {
      tsconfig: {
        jsx: "react-jsx",
      },
    },
  },
};

/**
 * React Native testing configuration
 */
export const reactNativeConfig = {
  ...baseConfig,
  testEnvironment: "node",
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

/**
 * Next.js testing configuration
 */
export const nextjsConfig = {
  ...reactConfig,
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["next/dist/build/swc/jest-transformer", {}],
  },
};

export default {
  baseConfig,
  reactConfig,
  reactNativeConfig,
  nextjsConfig,
};
