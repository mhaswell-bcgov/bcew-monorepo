#!/usr/bin/env bash
set -euo pipefail

PROJECT_PATH="${1:?project path required}"
PROJECT_NAME="${2:?project name required}"
VERSION="${3:-}"
ASSET_NAME="${ASSET_NAME:?ASSET_NAME required}"

REPO_ROOT="$(git rev-parse --show-toplevel)"
OUTPUT_ZIP="${REPO_ROOT}/${PROJECT_PATH}/${ASSET_NAME}"

cd "${REPO_ROOT}"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

(
  cd "${PROJECT_PATH}"
  git archive HEAD . | tar -x -C "${TMP}"
)

if [[ -d "${PROJECT_PATH}/dist" ]]; then
  cp -R "${PROJECT_PATH}/dist" "${TMP}/dist"
fi

if [[ "${VERSION}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  set_wordpress_version() {
    local file="$1"
    local pattern="$2"
    sed "${pattern}" "${file}" > "${file}.tmp"
    mv "${file}.tmp" "${file}"
  }

  if [[ -f "${TMP}/style.css" ]]; then
    set_wordpress_version "${TMP}/style.css" "s/^Version:[[:space:]]*.*/Version:      ${VERSION}/"
    echo "Set theme version to ${VERSION} in release style.css"
  elif [[ -f "${TMP}/${PROJECT_NAME}.php" ]]; then
    set_wordpress_version "${TMP}/${PROJECT_NAME}.php" "s/^\([[:space:]]*\*[[:space:]]*Version:\)[[:space:]]*.*/\\1           ${VERSION}/"
    echo "Set plugin version to ${VERSION} in release ${PROJECT_NAME}.php"
  else
    echo "No style.css or ${PROJECT_NAME}.php in release tree — skipping version update."
  fi
else
  echo "Version '${VERSION}' is not X.Y.Z — skipping WordPress version update in release artifact."
fi

rm -f "${OUTPUT_ZIP}"
(
  cd "${TMP}"
  zip -rq "${OUTPUT_ZIP}" .
)

echo "Created ${OUTPUT_ZIP}"
