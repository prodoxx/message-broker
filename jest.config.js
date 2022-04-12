module.exports = {
    clearMocks: true,
    moduleFileExtensions: ['js', 'ts'],
    roots: ['<rootDir>'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    setupFilesAfterEnv: ['jest-extended'],
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    globals: {
        'ts-jest': {
            diagnostics: false
        }
    }
};
