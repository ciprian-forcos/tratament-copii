import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    // Ignore everything except our source
    ignores: [
      'dist/**',
      'node_modules/**',
      '**/*.min.js',
      'public/**',
    ],
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['src/**/*.{ts,tsx,js,jsx}', 'eslint.config.js', 'vite.config.ts'],
  })),
  {
    files: ['src/**/*.{ts,tsx,js,jsx}', 'eslint.config.js', 'vite.config.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // react-hooks plugin not installed — suppress the missing-rule error
      'react-hooks/exhaustive-deps': 'off',
    },
  },
)
