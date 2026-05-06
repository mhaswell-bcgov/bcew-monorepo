# Release and deployment model

## Source of truth

The **`bcgov/wordpress-monorepo`** repository (this monorepo) is the **source of truth** for code, history, and automation. Day-to-day development happens on branches; **releases** are cut from tagged commits.

## How consumers get packages today

1. A maintainer pushes a **namespaced tag** (see [Versioning](./versioning.md)): `<nx-project-name>/v<semver>`.
2. **`tag.yml`** builds the project, attaches **`dist.zip`** to a **GitHub Release** on this repository, and updates the Composer package index **`packages.json`** published to GitHub Pages at `https://bcgov.github.io/wordpress-monorepo/`.
3. Downstream WordPress stacks add the Composer **repository** URL and `require` the package by name and version.

The `packages.json` entries point `dist.url` at the release asset on **this** GitHub repo (`update-packages.php` uses `github.com/<repository>/releases/download/...`).

## Read-only mirror repositories (organizational pattern)

Some organizations also maintain **read-only mirror** GitHub repositories per product (for example one repo per plugin) for browsing, integrations, or policy. Those mirrors are **not** the source of truth and must not accept direct pushes from humans.

**Typical setup (documentation for platform teams):**

| Concern | Recommendation |
| --- | --- |
| **Creation** | Create an empty repository; disable merge permissions for most users; mark as mirror or archival in the description. |
| **Updates** | Automation pushes **only** from trusted CI (monorepo release job or a dedicated sync job), for example using `git push --mirror` or subtree splits, depending on policy. |
| **Branch protection** | Require reviews on the monorepo; mirrors often allow **no** direct commits and only bot pushes. |
| **Authentication** | Use a **fine-scoped PAT** or GitHub App token stored as a **repository secret**; never commit tokens. Rotate on schedule. |

**Current automation note:** The workflows in this repository implement **release assets and Composer index** from the monorepo. **Mirror push automation** is organization-specific; if your program uses mirrors, document the exact job name and token secret in your internal runbooks and link them from here when available.

**Ownership:** Platform / DevOps (confirm who operates mirror sync and PAT lifecycle).

## Release flow (high level)

1. Developers merge work to `main` via pull request.
2. A maintainer pushes a **namespaced version tag** for the Nx project being released.
3. **`tag.yml`** builds that project, publishes **`dist.zip`** on a GitHub Release, and updates **`packages.json`** on GitHub Pages.

### Manual vs automated steps

| Step | Usually |
| --- | --- |
| Code review and merge | Manual |
| Choosing version and pushing tag | Manual (maintainer) |
| Build, zip, GitHub Release, `packages.json` deploy | **Automated** in `tag.yml` |
| Mirror repository update (if used) | Often automated elsewhere; **not** defined in this repo’s default workflows |

## Composer consumer configuration

Example (adjust package name and version):

```json
{
  "repositories": [
    {
      "type": "composer",
      "url": "https://bcgov.github.io/wordpress-monorepo"
    }
  ],
  "require": {
    "bcgov-plugin/bcgov-wordpress-blocks": "^1.0"
  }
}
```
