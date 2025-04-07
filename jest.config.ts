import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$' : 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$' : ['ts-jest', { tsconfig: 'tsconfig.app.json', isolatedModules: true }],
    '^.+\\.(js|jsx)$' : 'babel-jest', // If you use Babel
  },
  // You might need to configure Babel if you use it explicitly
  // "transformIgnorePatterns": [
  //   "/node_modules/",
  //   "\\.pnp\\.[^/]+$"
  // ]
};

export default config; 