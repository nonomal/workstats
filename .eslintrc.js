module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['prettier', '@typescript-eslint', 'react', 'unused-imports'],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'prefer-const': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    // no-unused
    'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }
    ]
    // max-props-per-line to 1
    // 'react/jsx-first-prop-new-line': [1, 'multiline'],
    // 'react/jsx-max-props-per-line': [1, { maximum: 1 }]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
