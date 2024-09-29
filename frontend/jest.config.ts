import type { Config } from 'jest';

const config: Config = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/src/setupJest.ts"],
  reporters: ["default", "jest-junit"],
  transformIgnorePatterns: [
      "!node_modules/"
    ]
};

export default config;