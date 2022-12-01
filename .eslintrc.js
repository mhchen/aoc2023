module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-unused-vars': 2,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/naming-convention': 0,
    'consistent-return': 0,
    'import/extensions': 0,
    'no-await-in-loop': 0,
    'no-continue': 0,
    'no-labels': 0,
    'no-restricted-syntax': 0,
    'no-plusplus': 0,
    'no-void': 0,
  },
};
