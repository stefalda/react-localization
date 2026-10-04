/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { createRequire } from 'module';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');


export default defineConfig({
    plugins: [react() as any],
    build: {
        outDir: 'lib/',
        emptyOutDir: true,
        lib: {
            entry: resolve(import.meta.dirname, 'src/LocalizedStrings.tsx'),
            name: 'ReactLocalization',
            formats: ['es', 'umd'],
            fileName: (format) => format === 'umd'
                ? 'react-localization.umd.cjs'
                : `react-localization.${format}.js`
        },
        rollupOptions: {
            external: [...Object.keys(pkg.peerDependencies)],
            output: {
                globals: {
                    react: 'React'
                }
            }
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['spec/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        // Test the source directly instead of the built lib/ artifact, so a
        // stale build can never make the suite pass/fail incorrectly.
        alias: {
            'react-localization': resolve(import.meta.dirname, 'src/LocalizedStrings.tsx')
        }
    }
});


