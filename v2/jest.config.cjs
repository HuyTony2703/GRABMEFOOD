module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['<rootDir>/tests/unit/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: { target: 'ES2022', module: 'CommonJS', esModuleInterop: true, strict: true },
    }],
  },
  moduleNameMapper: {
    '^@grabmefood/config$': '<rootDir>/packages/config/dist/index.js',
    '^@grabmefood/contracts$': '<rootDir>/packages/contracts/dist/index.js',
  },
};
