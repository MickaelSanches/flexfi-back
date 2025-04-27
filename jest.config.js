module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/app.ts',
    '!src/types/**/*.ts',
    '!src/**/*.d.ts'
  ],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  globalSetup: '<rootDir>/src/tests/setup.ts'
}; 