module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    rules: {
        'no-console': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-explicit-any': 0,
        'prettier/prettier': [
            'error',
            {
                endOfFile: 'auto',
            },
        ],
    },
    ignorePatterns: ['dist/*'],
    overrides: [
        {
            files: ['test/**/*.spec.ts'],
            rules: {
                '@typescript-eslint/ban-ts-comment': 0,
            },
        },
    ],
}
