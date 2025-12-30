import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
    {
        ignores: [
            'dist/**',
        ]
    },
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_"
            }]
        }
    }
);
