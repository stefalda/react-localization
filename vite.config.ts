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
        lib: {
            entry: resolve(__dirname, 'src/LocalizedStrings.tsx'),
            name: 'ReactLocalization',
            formats: ['es', 'umd'],
            fileName: (format) => `react-localization.${format}.js`
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
    }
});


