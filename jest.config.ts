import { createDefaultEsmPreset, type JestConfigWithTsJest } from 'ts-jest'

const presetConfig = createDefaultEsmPreset({});

const jestConfig: JestConfigWithTsJest = {
    ...presetConfig,
    testMatch: ['**/*.test.ts'],
    testPathIgnorePatterns: ["<rootDir>/tealscript_contracts/", '@algorandfoundation/tealscript'],
    coveragePathIgnorePatterns: ["<rootDir>/tealscript_contracts/", '@algorandfoundation/tealscript'],
    modulePathIgnorePatterns: ["<rootDir>/tealscript_contracts/", '@algorandfoundation/tealscript'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],    
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
                astTransformers: {
                    before: ['node_modules/@algorandfoundation/algorand-typescript-testing/test-transformer/jest-transformer.mjs'],
                },
            },
        ],
    },
    extensionsToTreatAsEsm: ['.ts'],
};

export default jestConfig;