# Package management and dependency rules

## npm / pnpm workspaces

The monorepo uses **pnpm** with workspaces defined in `pnpm-workspace.yaml`:

- `themes/*`
- `plugins/*`
- `packages/*`
- `tools/*`

Root `package.json` also lists `workspaces` for compatibility with tools that read it.

## Hoisting

pnpm installs dependencies into:

- A **root** `node_modules` with symlinks into workspace packages
- **Per-package** `node_modules` where needed for peer dependencies or isolation

**Expectation:** Hoisting reduces duplication, but **you must not rely on implicit hoisting** — a package must **declare every dependency** it imports in its own `package.json`. CI and fresh installs must succeed without “it worked because another package pulled it in.”

## Rules

1. **Declare own dependencies** — If `plugins/my-plugin/src/index.js` imports a package, that package must appear in `plugins/my-plugin/package.json` (`dependencies` or `devDependencies` as appropriate).
2. **Workspace protocol** — Internal packages use `workspace:*` when published through the workspace (for example shared npm packages under `packages/`).
3. **Single install** — Run `pnpm install` **once** at the monorepo root; do not ask contributors to `pnpm install` inside each plugin unless troubleshooting.
4. **Composer** — Run root `composer install` for monorepo PHP tooling; run `pnpm composer-install` (or `nx run <project>:composer-install`) for per-project vendors as needed.

## Composer path repositories

Plugins and themes often reference monorepo libraries via a **path** repository in `composer.json`:

```json
"repositories": [
  {
    "type": "path",
    "url": "../../packages/phpunit-config",
    "options": { "symlink": false }
  }
]
```

Keep relative paths correct for the package’s depth under `plugins/` or `themes/`.

## Troubleshooting

| Symptom | Things to check |
| --- | --- |
| **Module not found** after adding an import | Add the dependency to that package’s `package.json` and run `pnpm install` from root. |
| **Wrong version** of a transitive dep | Add a **direct** devDependency or use pnpm `overrides` at root (sparingly, with team agreement). |
| **Peer dependency warnings** | Install the peer into the package that consumes it or align versions with `@wordpress/*` packages. |
| **Duplicate React** or block editor issues | Ensure a single version of `@wordpress/*` across the workspace; check root and package `package.json` alignment. |
| **Composer path not found** | Verify `url` in `composer.json` relative to the package directory. |

## Lockfiles

- **`pnpm-lock.yaml`** is committed at the root — keep it authoritative for JS.
- **Per-package `composer.lock`** — follow team policy; many migrations remove per-package locks in favor of reproducible installs from `composer.json` constraints. Confirm with maintainers before deleting.
