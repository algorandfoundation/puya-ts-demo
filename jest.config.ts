import { createDefaultEsmPreset, type JestConfigWithTsJest } from "ts-jest";

const presetConfig = createDefaultEsmPreset({});
const ignorePatterns = ["@algorandfoundation/tealscript"];

const jestConfig: JestConfigWithTsJest = {
  ...presetConfig,
  testMatch: ["**/*.test.ts"],
  testPathIgnorePatterns: ignorePatterns,
  coveragePathIgnorePatterns: ignorePatterns,
  modulePathIgnorePatterns: ignorePatterns,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          target: "ES2023",
        },
        useESM: true,
        astTransformers: {
          before: [
            "node_modules/@algorandfoundation/algorand-typescript-testing/test-transformer/jest-transformer.mjs",
          ],
        },
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
};

export default jestConfig;
