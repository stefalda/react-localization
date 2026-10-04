# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-10-04

Behaviour of `formatString` is now aligned with the
[`localized-strings`](https://github.com/stefalda/localized-strings) package,
which this library builds upon. The override still exists only to add React
(JSX) interpolation, but it no longer drops the base package features.

### Added

- `formatString` now expands `$ref{key}` references, e.g.
  `strings.formatString(strings.questionWithReferences)`.
- `formatString` accepts a string key directly, with dot-notation support, e.g.
  `strings.formatString("fridge.bread")`.
- `getContent()` added to the public TypeScript types (aligned with
  `localized-strings` 2.1.x).

### Fixed

- `$ref{key}` placeholders are no longer silently dropped. Previously the inner
  `{key}` was treated as an unknown named placeholder and removed from the
  output.
- `require("react-localization")` now returns the library instead of an empty
  object. The UMD bundle is emitted as `.cjs` and `main`/`exports.require` point
  to it; previously the `require` entry resolved to an ES module that could not
  be loaded as CommonJS.
- `getString()` is now correctly typed as returning `string | null`.
- The placeholder regular expression no longer contains a literal `|`
  (`/(\{[\d|\w]+\})/` → `/(\{\w+\})/`).
- Tests work again with jsdom 30, where `navigator` is a getter-only property
  (`vi.stubGlobal` is used instead of direct assignment).

### Changed

- React element interpolation now uses `React.cloneElement` to assign keys
  instead of spreading the element object, which is discouraged in React 19.
- The test suite runs against `src/` through a Vitest alias instead of the
  built `lib/` artifact, so a stale build can no longer make the suite pass or
  fail incorrectly.
- `npm test` runs the suite once (`vitest run`); `npm run test:watch` is
  available for watch mode.
- The library instance's `formatString` is now a regular method (previously an
  arrow function) so it can access the instance for `$ref`/key resolution.

### Dependencies

- `localized-strings`: `^2.0.3` → `^2.1.2`
- `typescript`: `^5.7.3` → `^6.0.3`
- `react` / `react-dom`: `^19.0.0` → `^19.3.0`
- `@types/react` / `@types/react-dom`: `^19.0.4` / `^19.0.2` → `^19.3.0`
- `@types/node`: `^22.10.5` → `^26.6.4`
- `vite`: `^6.0.7` → `^8.3.2`
- `vitest`: `^2.1.8` → `^5.0.3`
- `@vitejs/plugin-react`: `^4.3.4` → `^6.1.1`
- `jsdom`: `^26.0.0` → `^30.1.1`
- `@testing-library/react`: `^16.1.0` → `^16.3.3`

### Notes

- TypeScript 6 requires an explicit `rootDir` when `declarationDir` is used.
- The Vite config now uses `import.meta.dirname` instead of `__dirname`.

[2.1.0]: https://github.com/stefalda/react-localization/compare/v2.0.6...v2.1.0
