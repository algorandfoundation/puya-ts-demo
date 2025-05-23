import { createDefaultEsmPreset, type JestConfigWithTsJest } from "ts-jest";

const presetConfig = createDefaultEsmPreset({});
const ignorePatterns = [
  "<rootDir>/contracts/simple/simple.e2e.ts",
  "<rootDir>/contracts/itxns/itxns.e2e.ts",
  "@algorandfoundation/tealscript",
];

const jestConfig: JestConfigWithTsJest = {
  ...presetConfig,
  testMatch: ["**/*.test.ts", "**/*.e2e.ts"],
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
  testTimeout: 30_000,
};

export default jestConfig;
