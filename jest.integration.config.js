module.exports = {
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  testMatch: ['<rootDir>/__tests__/integration/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  testTimeout: 30000,
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
};
